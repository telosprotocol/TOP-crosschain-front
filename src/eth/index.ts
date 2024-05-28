import Web3 from 'web3';
import tokenAbi from './abi-token';
import topTokenAbi from './abi-TOPToken';
import ethLockerAbi from './abi-ETHLocker';
import ethBridgeAbi from './abi-ETHBridge';
import topBridgeAbi from './abi-TOPBridge';
import limitAbi from './abi-Limit';
import { getWalletConnectWeb3 } from '@/store/walletConnectStore';
import { ethers, providers } from 'ethers';

export let web3: Web3;

export const isDev = process.env.NODE_ENV === 'development';

export const ETHEREUM_STORAGE_KEY = '_CROSS_CHAIN_SELECT_ETHEREUM';
export const IS_CONNECT_STORAGE_KEY = '_CROSS_CHAIN_IS_CONNECT';

export function getEthereum() {
  const v = localStorage.getItem(ETHEREUM_STORAGE_KEY);
  if (v === 'topia') {
    return window.topiaEthereum;
  } else {
    return window.ethereum;
  }
}

/**
 * @returns {web3} @type [object]
 * @throws code: 1, code: 2
 */
export const getWeb3 = (): Web3 => {
  if (web3) {
    return web3;
  }
  const ethereum = getEthereum();
  if (ethereum) {
    web3 = new Web3(ethereum);
    window.web3 = web3;
  } else {
    throw { code: 2, message: 'Not Install Metamask' };
  }
  return web3;
};

/**
 * @param {name} @requires @type [string] contract name
 * @returns {web3.eth.contract} @type [object] contract instance
 * @throws {code: 1, code: 2}
 */
export const getContract = (name: string, tokenAddr: string, w3?: Web3) => {
  let contract;
  let web3: any = w3;
  if (!web3) {
    web3 = getWeb3();
  }
  if (!web3) {
    throw { code: 2 };
  }

  if (name === 'token') {
    contract = new web3.eth.Contract(tokenAbi, tokenAddr);
    return contract;
  }
  if (name === 'topTokenAbi') {
    contract = new web3.eth.Contract(topTokenAbi, tokenAddr);
    return contract;
  }
  if (name === 'ethBridgeLockAbi') {
    contract = new web3.eth.Contract(ethLockerAbi, tokenAddr);
    return contract;
  }
  if (name === 'ethBridgeUnlockAbi') {
    contract = new web3.eth.Contract(topBridgeAbi, tokenAddr);
    return contract;
  }
  if (name === 'topBridgeUnlockAbi') {
    contract = new web3.eth.Contract(topBridgeAbi, tokenAddr);
    return contract;
  }
  if (name === 'topBridgeUnlockAbi1') {
    const ethereum = getEthereum();
    const web3Provider = new providers.Web3Provider(ethereum);
    contract = new ethers.Contract(
      tokenAddr,
      topBridgeAbi,
      web3Provider.getSigner()
    );
    return contract;
  }
  if (name === 'limitAbi') {
    contract = new web3.eth.Contract(limitAbi, tokenAddr);
    return contract;
  }

  throw { code: 1, message: 'unknow contract name' };
};

export const getWalletConnectContract = (
  name: string,
  tokenAddr: string,
  w3?: Web3
) => {
  let contract;
  let web3: any = w3;
  if (!web3) {
    web3 = getWalletConnectWeb3();
  }
  if (name === 'token') {
    contract = new web3.eth.Contract(tokenAbi, tokenAddr);
    return contract;
  }
  if (name === 'ethBridgeLockAbi') {
    contract = new web3.eth.Contract(ethLockerAbi, tokenAddr);
    return contract;
  }
  if (name === 'ethBridgeUnlockAbi') {
    contract = new web3.eth.Contract(ethLockerAbi, tokenAddr);
    return contract;
  }
  if (name === 'limitAbi') {
    contract = new web3.eth.Contract(limitAbi, tokenAddr);
    return contract;
  }

  if (name === 'ethBridgeAbi') {
    contract = new web3.eth.Contract(ethBridgeAbi, tokenAddr);
    return contract;
  }

  throw { code: 1, message: 'unknow contract name' };
};
