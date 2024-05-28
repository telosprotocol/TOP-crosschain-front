import { ETH_RPC, TOP_RPC } from '@/config';
import { getWalletConnectWeb3 } from '@/store/walletConnectStore';
import { accuracy, formatBalance, sleep } from '@/utils';
import utils from 'web3-utils';
import {
  getETHLockContractAddr,
  getTOPUnlockContractAddr,
} from '@/utils/addressConfig';
import Web3 from 'web3';
import { getContract, getWalletConnectContract, getWeb3, isDev } from './index';
import { getEthQueryWeb3, getTopQueryWeb3 } from './queryWeb3';

async function getEthGasPrice() {
  try {
    const web3: any = getWalletConnectWeb3();
    const gasPrice = await web3.eth.getGasPrice();
    return {
      gasPrice,
    };
  } catch (error) {
    return {};
  }
}

export async function getTOPfee() {
  const block = await ethRpcFetch(
    {
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
      jsonrpc: '2.0',
    },
    TOP_RPC
  );
  const maxPriorityFeePerGas = await ethRpcFetch(
    {
      method: 'eth_maxPriorityFeePerGas',
      params: [],
      id: 1,
      jsonrpc: '2.0',
    },
    TOP_RPC
  );
  return {
    maxPriorityFeePerGas: maxPriorityFeePerGas.result,
    maxFeePerGas: block.result.baseFeePerGas,
    type: '0x2',
  };
}

/**
 * @param {string} addr
 * @param {string | BigNumber} value
 * @param {string} value
 */
export const transfer = async (value, fromAddr, toAddr, tokenAddr: string) => {
  try {
    const topContract = await getContract('token', tokenAddr);
    const data = await new Promise((resolve, reject) => {
      topContract.methods
        .transfer(toAddr, value)
        .send({
          gas: '120000',
          from: fromAddr,
        })
        .on('transactionHash', hash => resolve(hash))
        //.on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// BSC HECO
export const burn = async (value, fromAddr, tokenAddr: string) => {
  try {
    const topContract = await getContract('topTokenAbi', tokenAddr);
    const data = await new Promise((resolve, reject) => {
      topContract.methods
        .burn(value)
        .send({
          gas: '120000',
          from: fromAddr,
        })
        .on('transactionHash', hash => resolve(hash))
        //.on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTokenInfo = async (addr, tokenAddr, w3?: Web3) => {
  try {
    const contract = getContract('token', tokenAddr, w3);
    let balance = 0;
    if (addr) {
      balance = await contract.methods.balanceOf(addr).call();
    }
    const decimals = await contract.methods.decimals().call();

    return {
      balance,
      decimals,
    };
  } catch (error) {
    console.log('getTokenInfo', addr, tokenAddr);
    throw error;
  }
};

export const walletConnectGetTokenInfo = async (addr, tokenAddr, w3) => {
  try {
    console.log('walletConnectGetTokenInfo1', addr, tokenAddr);
    const contract = getWalletConnectContract('token', tokenAddr, w3);
    let balance = 0;
    if (addr) {
      balance = await contract.methods.balanceOf(addr).call();
    }
    const decimals = await contract.methods.decimals().call();
    return {
      balance,
      decimals,
    };
  } catch (error) {
    console.log('walletConnectGetTokenInfo', error);
    throw error;
  }
};

export const walletConnectGetEthBalance = async (addr, w3) => {
  try {
    let web3: any = w3;
    if (!w3) {
      web3 = getWalletConnectWeb3();
    }
    const balance = await web3.eth.getBalance(addr);
    return {
      balance,
      decimals: 18,
    };
  } catch (error) {
    console.log('walletConnectGetEthBalance', error);
    throw error;
  }
};

export const getEthBalance = async (addr, w3) => {
  try {
    let web3: any = w3;
    if (!web3) {
      web3 = getWeb3();
    }
    const balance = await web3.eth.getBalance(addr);
    return {
      balance,
      decimals: 18,
    };
  } catch (error) {
    console.log('getEthBalance', error);
    throw error;
  }
};

export const ethPoolBalance = async (addr, contractAddr, w3) => {
  try {
    const contract = getWalletConnectContract('token', contractAddr, w3);
    let balance = 0;
    if (addr) {
      balance = await contract.methods.balanceOf(addr).call();
    }
    const decimals = await contract.methods.decimals().call();
    return {
      balance,
      decimals,
      accBalance: formatBalance(accuracy(balance, decimals, 6)),
    };
  } catch (error) {
    console.log('poolBalance', error);
    throw error;
  }
};

export const ethEthPoolBalance = async (addr, w3) => {
  try {
    let web3: any = w3;
    if (!web3) {
      web3 = getWalletConnectWeb3();
    }
    let balance = 0;
    if (addr) {
      balance = await web3.eth.getBalance(addr);
    }
    const decimals = 18;
    return {
      balance,
      decimals,
      accBalance: formatBalance(accuracy(balance, decimals, 6)),
    };
  } catch (error) {
    console.log('poolBalance', error);
    throw error;
  }
};

// lock wallect connect token
export const lockEthToken = async (
  fromAssetHash: string,
  amount: string | 0,
  receiverAddress: string,
  fromAddr: string,
  cb: any
) => {
  try {
    const gasPriceObj = await getEthGasPrice();
    const web3: any = getWalletConnectWeb3();
    const contract = getWalletConnectContract(
      'ethBridgeLockAbi',
      getETHLockContractAddr(fromAssetHash)
    );
    // await contract.methods
    //   .lockToken(fromAssetHash, amount, receiverAddress)
    //   .estimateGas();
    const functionSelector = contract.methods
      .lockToken(fromAssetHash, amount, receiverAddress)
      .encodeABI();
    const estimatedGas = await web3.eth.estimateGas({
      to: getETHLockContractAddr(fromAssetHash),
      data: functionSelector,
      from: fromAddr,
      value:
        fromAssetHash === '0x0000000000000000000000000000000000000000'
          ? amount
          : 0,
    });
    const sendObj: any = {
      gas: Math.floor(Number(estimatedGas) * 1.2),
      from: fromAddr,
      ...gasPriceObj,
    };
    if (fromAssetHash === '0x0000000000000000000000000000000000000000') {
      sendObj.value = amount;
      sendObj.amount = amount;
    }
    const data = await new Promise((resolve, reject) => {
      contract.methods
        .lockToken(fromAssetHash, amount, receiverAddress)
        .send(sendObj)
        .on('transactionHash', hash => cb(hash))
        .on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    await sleep(3000);
    return data;
  } catch (error) {
    console.log('lockToken', fromAssetHash, amount, receiverAddress, error);
    throw error;
  }
};

// lock wallect connect token
export const lockTOPToken = async (
  fromAssetHash: string,
  amount: string | 0,
  receiverAddress: string,
  fromAddr: string,
  cb: any
) => {
  try {
    const gasPriceObj = await getTOPfee();
    const contract = getContract(
      'topBridgeUnlockAbi',
      getTOPUnlockContractAddr(fromAssetHash)
    );
    const estimateGas = await contract.methods
      .burn(fromAssetHash, amount, receiverAddress)
      .estimateGas({ from: fromAddr });
    console.log('burn estimateGas', Number(estimateGas));
    const gas = parseInt(Number(estimateGas) * 1.2 + '', 10);
    const newRawTx = await getRawTx({ gas: utils.numberToHex(gas) }, TOP_RPC);
    const data = await new Promise((resolve, reject) => {
      contract.methods
        .burn(fromAssetHash, amount, receiverAddress)
        .send({
          gas,
          from: fromAddr,
          ...newRawTx,
          ...gasPriceObj,
        })
        .on('transactionHash', hash => cb(hash))
        .on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    await sleep(3000);
    return data;
  } catch (error) {
    console.log(
      'burn',
      {
        contractAddr: getTOPUnlockContractAddr(fromAssetHash),
        fromAssetHash,
        amount,
        receiverAddress,
      },
      error
    );
    throw error;
  }
};

export const approveEth = async (
  spender,
  value,
  from,
  callback,
  contractAddr
) => {
  try {
    const contract = getWalletConnectContract('token', contractAddr);
    const gasPriceObj = await getEthGasPrice();
    const functionSelector = contract.methods
      .approve(spender, value)
      .encodeABI();
    const web3: any = getWalletConnectWeb3();
    const estimatedGas = await web3.eth.estimateGas({
      to: contractAddr,
      data: functionSelector,
      from,
    });
    // const maxPriorityFeePerGasVal = await callEthRpc(
    //   'eth_maxPriorityFeePerGas'
    // );
    const data = await new window.Promise((resolve, reject) => {
      contract.methods
        .approve(spender, value)
        .send({
          gas: Math.floor(Number(estimatedGas) * 1.2),
          from,
          ...gasPriceObj,
          // maxPriorityFeePerGas: maxPriorityFeePerGasVal,
        })
        .on('transactionHash', hash => callback(hash))
        .on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const approveTop = async (
  spender,
  value,
  from,
  callback,
  contractAddr
) => {
  try {
    const contract = getContract('token', contractAddr);
    const gasPriceObj = await getTOPfee();
    const web3: any = getWeb3();
    const functionSelector = contract.methods
      .approve(spender, value)
      .encodeABI();
    const estimatedGas = await web3.eth.estimateGas({
      to: contractAddr,
      data: functionSelector,
      from,
    });
    const gas = Math.floor(Number(estimatedGas) * 2.2);
    const newRawTx = await getRawTx({ gas: utils.numberToHex(gas) }, TOP_RPC);
    const data = await new window.Promise((resolve, reject) => {
      contract.methods
        .approve(spender, value)
        .send({
          gas,
          from,
          ...newRawTx,
          ...gasPriceObj,
        })
        .on('transactionHash', hash => callback(hash))
        .on('receipt', d => resolve(d))
        .on('error', error => reject(error));
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEthAllowance = async (addr, spender, contractAddr) => {
  try {
    const contract = getWalletConnectContract('token', contractAddr);
    const allowance = await contract.methods.allowance(addr, spender).call();
    return allowance;
  } catch (error) {
    return 0;
  }
};

export const getTopAllowance = async (addr, spender, contractAddr) => {
  try {
    const contract = getContract('token', contractAddr);
    const allowance = await contract.methods.allowance(addr, spender).call();
    return allowance;
  } catch (error) {
    return 0;
  }
};

export const getEthLimit = async tokenAddr => {
  try {
    const ethBridgeUnlockAddr = getETHLockContractAddr(tokenAddr);
    const contract = getWalletConnectContract(
      'ethBridgeUnlockAbi',
      ethBridgeUnlockAddr,
      getEthQueryWeb3()
    );
    const limitAddress = await contract.methods.limit().call();
    const limitContract = getWalletConnectContract(
      'limitAbi',
      limitAddress,
      getEthQueryWeb3()
    );
    const result = await limitContract.methods.tokenQuotas(tokenAddr).call();
    return result;
  } catch (error) {
    console.log('getEthLimit', error);
    return [0, 0];
  }
};

export const getTopLimit = async tokenAddr => {
  try {
    const contract = getContract(
      'topBridgeUnlockAbi',
      getTOPUnlockContractAddr(tokenAddr),
      getTopQueryWeb3()
    );
    const limitAddress = await contract.methods.limiter().call();
    const limitContract = getContract(
      'limitAbi',
      limitAddress,
      getTopQueryWeb3()
    );
    const result = await limitContract.methods.tokenQuotas(tokenAddr).call();
    return result;
  } catch (error) {
    console.log('getTopLimit', error);
    return [0, 0];
  }
};

async function ethRpcFetch(params: any, rpc: string) {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const options: any = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    // mode: 'no-cors',
    body: JSON.stringify(params),
  };
  const res = await fetch(rpc, options);
  const response = await res.json();
  return response;
}

export async function getRawTx({ gas }: { gas: string }, rpc) {
  const maxPriorityFeePerGas = await getMaxPriorityFeeGas(rpc);
  const maxFeePerGas = await getMaxFeePerGas(rpc);
  return {
    maxFeePerGas,
    maxPriorityFeePerGas,
  };
}

export async function getMaxPriorityFeeGas(rpc) {
  const res = await ethRpcFetch(
    {
      jsonrpc: '2.0',
      method: 'eth_maxPriorityFeePerGas',
      id: 1,
    },
    rpc
  );
  return res.result || '0x0';
}

export async function getMaxFeePerGas(rpc) {
  const maxPriorityFeePerGas = await getMaxPriorityFeeGas(rpc);
  const block = await getLatestBlock(rpc);
  return utils.toHex(
    utils
      .toBN(block.baseFeePerGas)
      .mul(utils.toBN(2))
      .add(utils.toBN(maxPriorityFeePerGas))
  );
}

export async function getLatestBlock(rpc) {
  const res = await ethRpcFetch(
    {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['latest', false],
      id: 1,
    },
    rpc
  );
  return res.result;
}
