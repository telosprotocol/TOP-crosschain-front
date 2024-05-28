import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: any;
    topiaEthereum: any;
    web3: Web3;
    topProvider: any;
    stores: any;
  }
}
