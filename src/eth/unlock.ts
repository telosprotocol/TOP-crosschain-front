import utils from 'web3-utils';
import { serialize } from 'borsh';
import Tree from 'merkle-patricia-tree';
import { encode } from 'eth-util-lite';
import { Header, Proof, Receipt, Log } from 'eth-object';
import Header1 from '../lib/eth-object-header/header';
import { promisfy } from 'promisfy';
import { getContract, getWalletConnectContract, getWeb3 } from '.';
import {
  getETHBridgeAddr,
  getETHLockContractAddr,
  getTOPUnlockContractAddr,
} from '@/utils/addressConfig';
import keccak256 from 'keccak256';
import RLP from 'rlp';
import {
  topRelay_getLeafBlockHashListByHash,
  topRelay_getPolyBlockHashListByHash,
  top_getRelayBlockByHash,
  top_getRelayTransactionReceipt,
} from './topRpc';
import { getEthQueryWeb3 } from './queryWeb3';
import { sleep } from '@/utils';
import { ETH_RPC, TOP_RPC } from '@/config';
import { getRawTx, getTOPfee } from './method';
const { toBuffer } = require('eth-util-lite');
const web3 = require('web3');

function receiptFromWeb3(web3Result) {
  const rpcResult = Object.assign({}, web3Result);
  rpcResult.cumulativeGasUsed = web3.utils.toHex(rpcResult.cumulativeGasUsed);
  if (web3Result.status === true) {
    rpcResult.status = '0x1';
  } else if (web3Result.status === false) {
    rpcResult.status = '0x0';
  }
  return Receipt.fromRpc(rpcResult);
}

function logFromWeb3(result) {
  return Log.fromRpc(result);
}

function headerFromWeb3(web3Result) {
  const rpcResult = Object.assign({}, web3Result);
  rpcResult.difficulty = web3.utils.toHex(rpcResult.difficulty);
  rpcResult.number = web3.utils.toHex(rpcResult.number);
  rpcResult.gasLimit = web3.utils.toHex(rpcResult.gasLimit);
  rpcResult.gasUsed = web3.utils.toHex(rpcResult.gasUsed);
  rpcResult.timestamp = web3.utils.toHex(rpcResult.timestamp);
  console.log('rpcResult.baseFeePerGas', rpcResult.baseFeePerGas);
  return Header1.fromRpc(rpcResult);
}

class EthProofExtractor {
  static fromWeb3: (web3: any) => EthProofExtractor;
  web3: any;
  initialize(web3) {
    this.web3 = web3;
  }

  async extractReceipt(txHash) {
    return await this.web3.eth.getTransactionReceipt(txHash);
  }

  async extractBlock(blockNumber) {
    return await this.web3.eth.getBlock(blockNumber);
  }

  async buildTrie(block) {
    const blockReceipts = await Promise.all(
      block.transactions.map(t => this.web3.eth.getTransactionReceipt(t))
    );
    // Build a Patricia Merkle Trie
    const tree = new Tree();
    await Promise.all(
      blockReceipts.map(receipt => {
        // if (
        //   receipt.transactionHash ===
        //   '0x37c4af110d4757b2d990aa54e3820332b125ed7681a0adcb8e607dee09e0dd62'
        // ) {
        //   receipt.status = true;
        // }
        // console.log('receipt.status receipt.transactionHash', receipt.status, receipt.transactionHash)
        const path = encode(receipt.transactionIndex);
        let serializedReceipt = receiptFromWeb3(receipt).serialize();
        if (receipt.type !== '0x0') {
          serializedReceipt = Buffer.concat([
            Buffer.from([receipt.type]),
            serializedReceipt,
          ]);
        }
        // console.log('serializedReceipt path 12412282 111', serializedReceipt, path);
        // console.log('serializedReceipt path 12412282 111', Buffer.from(serializedReceipt).toString('hex'), Buffer.from(path).toString('hex'));
        // console.log(
        //   web3.utils.bytesToHex(serializedReceipt),
        //   web3.utils.bytesToHex(path),
        //   receipt,
        //   path
        // );
        return promisfy(tree.put, tree)(path, serializedReceipt);
      })
    );
    return tree;
  }

  async buildTrieTOP(block) {
    const blockReceipts = await Promise.all(
      block.transactions.map(t => top_getRelayTransactionReceipt(t))
    );
    // Build a Patricia Merkle Trie
    const tree = new Tree();
    await Promise.all(
      blockReceipts.map(receipt => {
        const path = encode(receipt.transactionIndex);
        let serializedReceipt = receiptFromWeb3(receipt).serialize();
        if (receipt.type !== '0x0') {
          serializedReceipt = Buffer.concat([
            Buffer.from([receipt.type]),
            serializedReceipt,
          ]);
        }
        return promisfy(tree.put, tree)(path, serializedReceipt);
      })
    );
    return tree;
  }

  async buildTrieBlockTOP(blocks) {
    // Build a Patricia Merkle Trie
    const tree = new Tree();
    await Promise.all(
      blocks.map(b => {
        const path = encode(b.blockIndex);
        const serializedReceipt = toBuffer(b.blockHash);
        console.log(
          'polyBlocks hash',
          serializedReceipt,
          b.blockHash,
          b.blockIndex,
          path
        );
        return promisfy(tree.put, tree)(path, serializedReceipt);
      })
    );
    return tree;
  }

  async buildTrieTOPBlock(block) {
    const blockReceipts = await Promise.all(
      block.transactions.map(t => top_getRelayTransactionReceipt(t))
    );
    // Build a Patricia Merkle Trie
    const tree = new Tree();
    await Promise.all(
      blockReceipts.map(receipt => {
        const path = encode(receipt.transactionIndex);
        let serializedReceipt = receiptFromWeb3(receipt).serialize();
        if (receipt.type !== '0x0') {
          serializedReceipt = Buffer.concat([
            Buffer.from([receipt.type]),
            serializedReceipt,
          ]);
        }
        return promisfy(tree.put, tree)(path, serializedReceipt);
      })
    );
    return tree;
  }

  async extractProof(web3, block, tree, transactionIndex) {
    const [, , stack] = await promisfy(
      tree.findPath,
      tree
    )(encode(transactionIndex));

    const blockData = await web3.eth.getBlock(block.number);
    // Correctly compose and encode the header.
    const header = headerFromWeb3(blockData);
    return {
      header_rlp: header.serialize(),
      receiptProof: Proof.fromStack(stack),
      txIndex: transactionIndex,
    };
  }

  async extractProofTop(header, tree, transactionIndex) {
    const [, , stack] = await promisfy(
      tree.findPath,
      tree
    )(encode(transactionIndex));

    // console.log('Buffer.from', header)
    // console.log('Buffer.from', Buffer.from(header))
    // console.log('Buffer.from', Buffer.from(web3.utils.hexToBytes(header)))
    // console.log('Buffer.from', web3.utils.hexToBytes(header))
    return {
      // header_rlp: header.serialize(),
      header_rlp: Buffer.from(header.replace(/^0x/, ''), 'hex'),
      receiptProof: Proof.fromStack(stack),
      txIndex: transactionIndex,
    };
  }

  async extractBlockProofTop(tree, transactionIndex) {
    const [, , stack] = await promisfy(
      tree.findPath,
      tree
    )(encode(transactionIndex));

    return Proof.fromStack(stack);
  }

  destroy() {
    if (
      this.web3.currentProvider.connection &&
      this.web3.currentProvider.connection.close
    ) {
      // Only WebSocket provider has close, HTTPS don't
      this.web3.currentProvider.connection.close();
    }
  }
}

EthProofExtractor.fromWeb3 = web3 => {
  const extractor = new EthProofExtractor();
  extractor.web3 = web3;
  return extractor;
};

class TxProof {
  logIndex: any;
  proof: any;
  headerData: any;
  reciptData: any;
  reciptIndex: any;
  logEntryData: any;
  constructor(
    logIndex,
    logEntryData,
    reciptIndex,
    reciptData,
    headerData,
    proof
  ) {
    this.logIndex = logIndex;
    this.logEntryData = logEntryData;
    this.reciptIndex = reciptIndex;
    this.reciptData = reciptData;
    this.headerData = headerData;

    this.proof = proof;
  }
}

class TxProof2 {
  logIndex: any;
  proof: any;
  headerData: any;
  reciptData: any;
  reciptIndex: any;
  logEntryData: any;

  blockPoof: any;
  blockIndex: any;
  polyBlockHeight: any;
  receiptsRootHash: any;

  constructor(
    logIndex,
    logEntryData,
    reciptIndex,
    reciptData,
    headerData,
    proof,
    blockIndex,
    polyBlockHeight,
    blockPoof
  ) {
    this.logIndex = logIndex;
    this.logEntryData = logEntryData;
    this.reciptIndex = reciptIndex;
    this.reciptData = reciptData;
    this.proof = proof;

    this.blockPoof = blockPoof;
    this.headerData = headerData;
    this.blockIndex = blockIndex;
    this.polyBlockHeight = polyBlockHeight;
  }
}

export const unlockToken = async (
  hash: string,
  fromAddr: string,
  coinType: string,
  cb: any
) => {
  try {
    const ethWeb3Rpc = getEthQueryWeb3();
    const contract = getContract(
      'topBridgeUnlockAbi1',
      getTOPUnlockContractAddr(coinType)
    );
    const extractor = new EthProofExtractor();
    extractor.initialize(ethWeb3Rpc);
    const receipt = await extractor.extractReceipt(hash);
    console.log('receipt', receipt, ethWeb3Rpc, hash);
    // blockNumber transactionIndex
    const usedProofsParam = keccak256(
      `0x${receipt.blockNumber
        .toString(16)
        .padStart(64, '0')}${receipt.transactionIndex
        .toString(16)
        .padStart(64, '0')}`
    );
    const isUsedProofs = await contract.usedProofs(usedProofsParam);
    console.log(
      'usedProofs111',
      isUsedProofs,
      getTOPUnlockContractAddr(coinType)
    );
    if (isUsedProofs) {
      throw new Error('Has claimed');
    }
    const block = await extractor.extractBlock(receipt.blockNumber);
    const tree = await extractor.buildTrie(block);
    const extractedProof = await extractor.extractProof(
      ethWeb3Rpc,
      block,
      tree,
      receipt.transactionIndex
    );
    // destroy extractor here to close its web3 connection
    extractor.destroy();
    let txLogIndex = -1;
    let logFound = false;
    let log;
    for (const receiptLog of receipt.logs) {
      txLogIndex++;
      // const blockLogIndex = receiptLog.logIndex
      logFound = true;
      log = receiptLog;
    }
    console.log(
      'extractedProof.header_rlp',
      extractedProof.header_rlp.toString('hex')
    );
    const logEntryData = logFromWeb3(log).serialize();
    const receiptIndex = extractedProof.txIndex;
    let receiptData = receiptFromWeb3(receipt).serialize();
    if (receipt.type !== '0x0') {
      receiptData = Buffer.concat([Buffer.from([receipt.type]), receiptData]);
    }
    const headerData = extractedProof.header_rlp;
    const proof = [];
    for (const node of extractedProof.receiptProof) {
      console.log('node', node);
      proof.push(RLP.encode(node));
    }
    console.log({
      logIndex: txLogIndex,
      logEntryData,
      transactionIndex: log.transactionIndex,
      receiptData,
      headerData,
      proof,
    });
    const value = new TxProof(
      txLogIndex,
      logEntryData,
      log.transactionIndex,
      receiptData,
      headerData,
      proof
    );
    const schema = new Map([
      [
        TxProof,
        {
          kind: 'struct',
          fields: [
            ['logIndex', 'u64'],
            ['logEntryData', ['u8']],
            ['reciptIndex', 'u64'],
            ['reciptData', ['u8']],
            ['headerData', ['u8']],
            ['proof', [['u8']]],
          ],
        },
      ],
    ]);
    const buffer = serialize(schema, value);
    console.log(
      'buffer',
      (buffer as any).toString('hex'),
      web3.utils.bytesToHex(buffer)
    );
    const estimation = await contract.estimateGas.mint(
      web3.utils.bytesToHex(buffer),
      1
    );
    console.log('estimation', estimation, Number(estimation));
    const fee = await getTOPfee();
    const mintResult: any = await contract.mint(
      web3.utils.bytesToHex(buffer),
      1,
      {
        // gasLimit: 8800000,
        gasLimit: 2 * Number(estimation),
        ...fee,
      }
    );
    console.log('mintResult', mintResult);
    console.log('mintResult.hash', mintResult.hash);
    cb(mintResult.hash);
    const tr = await mintResult.wait();
    await sleep(3000);
    console.log('mint tr', tr);
    return tr;
  } catch (error) {
    console.log('unlockerror');
    throw error;
  }
};

export const topToEthUnlockToken = async (
  hash: string,
  fromAddr: string,
  coinType: string,
  cb: any
) => {
  try {
    const contract = getWalletConnectContract(
      'ethBridgeUnlockAbi',
      getETHLockContractAddr(coinType)
    );

    const bridgeContract = getWalletConnectContract(
      'ethBridgeAbi',
      getETHBridgeAddr(coinType)
    );

    const receipt = await top_getRelayTransactionReceipt(hash);
    console.log('receipt', receipt, getWeb3(), hash);
    // blockNumber transactionIndex
    const usedProofsParam = keccak256(
      `0x${receipt.blockNumber
        .toString(16)
        .padStart(64, '0')}${receipt.transactionIndex
        .toString(16)
        .padStart(64, '0')}`
    );
    const isUsedProofs = await contract.methods
      .usedProofs(usedProofsParam)
      .call();
    console.log('usedProofs', isUsedProofs);
    if (isUsedProofs) {
      throw new Error('Has claim');
    }
    const limitAddress = await contract.methods.limit().call();
    const limitContract = getWalletConnectContract('limitAbi', limitAddress);

    const forbiddensParam = keccak256(
      `0x${receipt.blockNumber
        .toString(16)
        .replace('0x', '')
        .padStart(64, '0')}${receipt.transactionIndex
        .toString(16)
        .replace('0x', '')
        .padStart(64, '0')}`
    );
    const isForbinndns = await limitContract.methods
      .forbiddens(forbiddensParam)
      .call();
    console.log('isForbinndns111', isForbinndns);
    if (isForbinndns) {
      throw new Error(
        'Sorry, your claim has been blocked on blockchain. Please contact the TOP support team for more information.'
      );
    }

    const extractorTop = new EthProofExtractor();

    // block start
    const polyBlocks = await topRelay_getPolyBlockHashListByHash(
      receipt.blockHash
    );
    console.log('polyBlocks1', polyBlocks);
    let rootHash = '';
    let res = await bridgeContract.methods
      .blockHashes(polyBlocks[0].blockHash)
      .call();
    if (res) {
      rootHash = polyBlocks[0].blockHash;
    } else {
      res = await bridgeContract.methods.blockHashes(polyBlocks[1]).call();
      if (res) {
        rootHash = polyBlocks[1].blockHash;
      }
    }

    if (!rootHash) {
      throw new Error('Error');
    }

    const rpcBlocks = await topRelay_getLeafBlockHashListByHash(rootHash);
    console.log('polyBlocks2', rpcBlocks);
    rpcBlocks.splice(-1);
    const blockTree = await extractorTop.buildTrieBlockTOP(rpcBlocks);
    rpcBlocks.filter(item => item.blockHash === receipt.blockHash);
    console.log('polyBlocks3', blockTree);
    const blockPoofTmp = await extractorTop.extractBlockProofTop(
      blockTree,
      rpcBlocks.filter(item => item.blockHash === receipt.blockHash)[0]
        .blockIndex
    );
    console.log('polyBlocks3.3', blockPoofTmp);
    const blockPoof = [];
    for (const node of blockPoofTmp) {
      console.log('polyBlocks3.3 node', node);
      blockPoof.push(RLP.encode(node));
    }
    console.log('polyBlocks4.5', blockPoof);
    // block end
    const relayBlock = await top_getRelayBlockByHash(receipt.blockHash);

    console.log('relayBlock', relayBlock);

    const tree = await extractorTop.buildTrieTOP({
      transactions: relayBlock.transactions,
    });
    console.log('tree', tree);
    const extractedProof = await extractorTop.extractProofTop(
      relayBlock.header,
      tree,
      receipt.transactionIndex
    );
    console.log('extractedProof', extractedProof);
    let txLogIndex = -1;

    let logFound = false;
    let log;
    for (const receiptLog of receipt.logs) {
      txLogIndex++;
      // const blockLogIndex = receiptLog.logIndex
      logFound = true;
      log = receiptLog;
    }
    console.log('extractedProof.header_rlp', extractedProof.header_rlp);
    const logEntryData = logFromWeb3(log).serialize();
    let receiptData = receiptFromWeb3(receipt).serialize();
    if (receipt.type !== '0x0') {
      receiptData = Buffer.concat([Buffer.from([receipt.type]), receiptData]);
    }
    const headerData = extractedProof.header_rlp;
    const proof = [];
    for (const node of extractedProof.receiptProof) {
      proof.push(RLP.encode(node));
    }

    const blockIndex = receipt.blockNumber;
    const blockHash = receipt.blockHash;
    const polyBlockHash = rootHash;
    const polyBlock = await top_getRelayBlockByHash(rootHash);

    const polyBlockHeight = polyBlock.number;
    const receiptsRootHash = relayBlock.receiptsRootHash;
    console.log('polyBlocks5', {
      txLogIndex,
      logEntryData,
      transactionIndex: Number(log.transactionIndex),
      receiptData,
      receiptsRootHash: Buffer.from(receiptsRootHash.replace(/^0x/, ''), 'hex'),
      proof,
      blockIndex: Number(blockIndex),
      blockHash: Buffer.from(blockHash.replace(/^0x/, ''), 'hex'),
      polyBlockHeight: Number(polyBlockHeight),
      blockPoof,
    });
    console.log('polyBlocks6', {
      txLogIndex,
      logEntryData: web3.utils.bytesToHex(logEntryData),
      transactionIndex: Number(log.transactionIndex),
      receiptData: web3.utils.bytesToHex(receiptData),
      receiptsRootHash: Buffer.from(receiptsRootHash.replace(/^0x/, ''), 'hex'),
      proof,
      blockIndex: Number(blockIndex),
      blockHash: Buffer.from(blockHash.replace(/^0x/, ''), 'hex'),
      polyBlockHeight: Number(polyBlockHeight),
      blockPoof: web3.utils.bytesToHex(blockPoof),
    });

    const value = new TxProof2(
      txLogIndex,
      logEntryData,
      Number(log.transactionIndex),
      receiptData,
      headerData,
      proof,
      Number(
        rpcBlocks.filter(item => item.blockHash === receipt.blockHash)[0]
          .blockIndex
      ),
      Number(polyBlockHeight),
      blockPoof
    );
    const schema = new Map([
      [
        TxProof2,
        {
          kind: 'struct',
          fields: [
            ['logIndex', 'u64'],
            ['logEntryData', ['u8']],
            ['reciptIndex', 'u64'],
            ['reciptData', ['u8']],
            ['headerData', ['u8']],
            ['proof', [['u8']]],
            ['blockIndex', 'u64'],
            ['polyBlockHeight', 'u64'],
            ['blockPoof', [['u8']]],
          ],
        },
      ],
    ]);
    const buffer = serialize(schema, value);
    console.log(
      'buffer',
      (buffer as any).toString('hex'),
      web3.utils.bytesToHex(buffer)
    );
    const estimation = await contract.methods
      .unlockToken(web3.utils.bytesToHex(buffer), 1)
      .estimateGas({ from: fromAddr });
    console.log('estimation', estimation);
    const gas = parseInt(Number(estimation) * 1.2 + '', 10);
    const newRawTx = await getRawTx({ gas: utils.numberToHex(gas) }, ETH_RPC);
    const data = await new Promise((resolve, reject) => {
      contract.methods
        .unlockToken(web3.utils.bytesToHex(buffer), 1)
        .send({
          gas,
          ...newRawTx,
          from: fromAddr,
        })
        .on('transactionHash', hash => cb(hash))
        .on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    await sleep(3000);
    return data;
  } catch (error) {
    console.log('unlockerror');
    if ((error as any).message.indexOf('proof is reused') > -1) {
      throw new Error('Has claimed');
    }
    throw error;
  }
};
