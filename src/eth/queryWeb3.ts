import { ETH_RPC, TOP_RPC } from '@/config';
import Web3 from 'web3';

// export const topRpc = 'http://192.168.50.167:8080';
export const topRpc = TOP_RPC;

export const ethInfuraId = '78be06b606074bde8e2dcc277282bb8e';
// export const ethRpc = 'https://ropsten.infura.io/v3/' + ethInfuraId;
export const ethRpc = ETH_RPC;

export const getTopQueryWeb3 = (): Web3 => {
  const web3 = new Web3(topRpc);
  return web3;
};

export const getEthQueryWeb3 = (): Web3 => {
  const web3 = new Web3(ethRpc);
  return web3;
};
