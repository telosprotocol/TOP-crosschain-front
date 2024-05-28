import { decode, toBuffer, KECCAK256_RLP_ARRAY, KECCAK256_NULL } from 'eth-util-lite'
import EthObject from './ethObject'

const defaultFields = [
  'parentHash',
  'sha3Uncles',
  'miner',
  'stateRoot',
  'transactionsRoot',
  'receiptRoot',
  'logsBloom',
  'difficulty',
  'number',
  'gasLimit',
  'gasUsed',
  'timestamp',
  'extraData',
  'mixHash',
  'nonce',
];

class Header extends EthObject{

  static get fields(){ return []}

  constructor(raw = this.NULL, fields = defaultFields){
    super(fields, raw)
  }

  static fromBuffer(buf){ return buf ? new this(decode(buf)) : new this() }
  static fromHex(hex){ return hex ? new this(decode(hex)) : new this() }
  static fromRaw(raw){ return new this(raw) }
  static fromObject(rpcResult){ return this.fromRpc(rpcResult) }
  static fromRpc(rpcResult){
    if (rpcResult) {
      const raw = [
        toBuffer(rpcResult.parentHash),
        toBuffer(rpcResult.sha3Uncles) || KECCAK256_RLP_ARRAY,
        toBuffer(rpcResult.miner),
        toBuffer(rpcResult.stateRoot) || KECCAK256_NULL,
        toBuffer(rpcResult.transactionsRoot) || KECCAK256_NULL,
        toBuffer(rpcResult.receiptsRoot) ||
          toBuffer(rpcResult.receiptRoot) ||
          KECCAK256_NULL,
        toBuffer(rpcResult.logsBloom),
        toBuffer(rpcResult.difficulty),
        toBuffer(rpcResult.number),
        toBuffer(rpcResult.gasLimit),
        toBuffer(rpcResult.gasUsed),
        toBuffer(rpcResult.timestamp),
        toBuffer(rpcResult.extraData),
        toBuffer(rpcResult.mixHash),
        toBuffer(rpcResult.nonce),
      ];
      const fields = [...defaultFields]
      if (typeof rpcResult.baseFeePerGas !== 'undefined') {
        fields.push('baseFeePerGas');
        raw.push(toBuffer(rpcResult.baseFeePerGas));
      }
      if (typeof rpcResult.withdrawalsRoot !== 'undefined') {
        fields.push('withdrawalsRoot');
        raw.push(toBuffer(rpcResult.withdrawalsRoot));
      }
      return new this(raw, fields);
    }else{
      return new this()
    }
  }
}

export default Header
