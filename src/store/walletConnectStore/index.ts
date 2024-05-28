import Web3 from 'web3';
import { observable, action, makeObservable } from 'mobx';
import { getWeb3, isDev } from '@/eth';
import { getTokenInfo } from '@/eth/method';
import { accuracy, formatAddress } from '@/utils';
import { Toast } from '@/components';
import { receiveAddress, token } from '@/api';
import { stores } from '..';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getIsUseConnectWallet } from '../chainStore';
import { ethInfuraId, ethRpc, topRpc } from '@/eth/queryWeb3';
import { ETH_CHAIN_ID } from '@/config';

let provider;
// await provider.enable();

/**
 * @returns {web3} @type [object]
 * @throws code: 1, code: 2
 */
export const getWalletConnectWeb3 = (): Web3 => {
  if (getIsUseConnectWallet()) {
    const web31: any = new Web3(provider as any);
    return web31;
  } else {
    return getWeb3();
  }
};

// export const getWalletConnectEthers = (): Web3 => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum)
// };

export const getWalletConnectProvider = () => {
  return provider;
};

const NETWORKS = {
  '1': 'Main Net',
  '2': 'Deprecated Morden test network',
  '3': 'Ropsten test network',
  '4': 'Rinkeby test network',
  '42': 'Kovan test network',
  '4447': 'Truffle Develop Network',
  '5777': 'Ganache Blockchain',
  '128': 'heco-mainnet',
  '256': 'heco-testnet',
  '1023': 'top-testnet',
  '980': 'TOP',
  '20212': 'ZSC',
  '1555': 'Eth test network',
};

const NETNAMES = {
  '128': 'HECO',
  '256': 'HECO',
  '1': 'ETH',
  '4': 'ETH',
  '3': 'ETH',
  '56': 'BSC',
  '97': 'BSC',
  TOP: 'TOP',
  '1023': 'TOP',
  '980': 'TOP',
  '1555': 'ETH',
  '11155111': 'ETH',
};

export default class WalletConnectStore {
  @observable
  public netId = '-1';
  @observable
  public chainId = '';
  @observable
  public netName = 'Unknow';
  @observable
  public account = '';
  @observable
  public balance = 0;
  @observable
  public balanceAll = '0';
  @observable
  public decimals = 18;
  @observable
  public topAddr = '';

  @observable
  public token = '';

  @observable
  public receiveAddress = '';

  constructor() {
    makeObservable(this);
  }

  get address() {
    return formatAddress(this.account);
  }

  get netShortName() {
    return NETNAMES[this.netId];
  }

  get isEthNetwork() {
    return this.netId === ETH_CHAIN_ID;
  }

  public initData() {
    this.netId = '-1';
    this.chainId = '';
    this.netName = 'Unknow';
    this.account = '';
    this.balance = 0;
    this.balanceAll = '0';
    this.decimals = 18;
  }

  @action.bound
  public async toogleAccount() {
    const web3 = getWalletConnectWeb3();
    const accounts = await web3.eth.getAccounts();
    const [account] = accounts;
    this.account = account;
    this.toogleTokenInfo();
  }

  @action.bound
  public async toogleNetwork() {
    const web3: any = getWalletConnectWeb3();
    const netId = String(await web3.eth.net.getId());
    console.log('this.netId', typeof this.netId, this.netId);
    this.netId = netId;
    this.netName = NETWORKS[netId] || 'Unknow';
    this.chainId = web3?.eth?.currentProvider?.chainId;
    this.getToken(netId);
    this.getReceiveAddress();
  }

  @action.bound
  public async toogleTokenInfo() {
    try {
      if (!this.account) {
        this.balance = 0;
        this.balanceAll = '0';
        return;
      }
      const token = await this.getToken(this.netId);
      if (!token) {
        return;
      }
      const { balance, decimals } = await getTokenInfo(this.account, token);
      console.log('getTokenInfo', this.account, token, balance);
      this.decimals = Number(decimals);
      this.balanceAll = accuracy(balance, this.decimals, this.decimals, true);
      this.balance = accuracy(balance, this.decimals, 8);
    } catch (error) {
      console.log('toogleTokenInfo');
      this.balance = 0;
      this.balanceAll = '0';
    }
  }

  @action.bound
  async getAllInfos() {
    await this.toogleNetwork();
    await this.toogleAccount();
  }

  @action.bound
  public async enable() {
    try {
      provider = new WalletConnectProvider({
        infuraId: ethInfuraId,
        rpc: {
          1023: topRpc,
          1555: ethRpc,
        },
      });
      // Subscribe to accounts change
      provider.on('accountsChanged', async (accounts: string[]) => {
        // console.log('walletconnect-accountsChanged', accounts);
        this.getAllInfos();
      });

      // Subscribe to chainId change
      provider.on('chainChanged', (chainId: number) => {
        console.log('walletconnect-chainChanged', chainId);
        this.getAllInfos();
      });

      // Subscribe to session disconnection
      provider.on('disconnect', (code: number, reason: string) => {
        console.log('walletconnect-disconnect', code, reason);
        this.initData();
      });
      await provider.enable();
      localStorage.setItem('_wcAutoConnect', '1');
      return true;
    } catch (e) {
      Toast.fail(stores.locale.getLocaleMessage('toast.contentFail'));
      console.log('enable');
      return false;
    }
  }

  @action.bound
  public async disconnect() {
    await provider.disconnect();
    window.localStorage.removeItem('walletconnect');
    window.localStorage.removeItem('_wcAutoConnect');
    this.initData();
  }

  public async swatchToTop() {
    addHecoNetwork();
  }

  public useOneWallet({ netId, account, chainId }) {
    this.netId = netId;
    this.account = account;
    this.netName = NETWORKS[netId];
    this.chainId = chainId;
  }

  @action.bound
  public async getToken(netId) {
    if (this.token) {
      return this.token;
    }
    if (!netId || netId === '-1' || netId === 'TOP') {
      return '';
    }
    return '';
  }
  @action.bound
  public async getReceiveAddress() {
    if (!this.netId || this.netId === '-1' || this.receiveAddress) {
      return '';
    }
    return '';
  }
}

export async function addBSCNetwork() {
  if (isDev) {
    addNetwork([
      {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
      },
    ]);
  } else {
    addNetwork([
      {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://www.bscscan.com/'],
      },
    ]);
  }
}

export async function addHecoNetwork() {
  if (isDev) {
    addNetwork([
      {
        chainId: '0x100',
        chainName: 'HECO Testnet',
        nativeCurrency: {
          name: 'HT',
          symbol: 'HT',
          decimals: 18,
        },
        rpcUrls: ['https://http-testnet.hecochain.com'],
        blockExplorerUrls: ['https://testnet.hecoinfo.com/'],
      },
    ]);
  } else {
    addNetwork([
      {
        chainId: '0x80',
        chainName: 'HECO Mainnet',
        nativeCurrency: {
          name: 'HT',
          symbol: 'HT',
          decimals: 18,
        },
        rpcUrls: ['https://http-mainnet.hecochain.com'],
        blockExplorerUrls: ['https://hecoinfo.com'],
      },
    ]);
  }
}

function addNetwork(params: any) {
  const { currentProvider }: any = getWalletConnectWeb3();
  currentProvider
    .request({ method: 'wallet_addEthereumChain', params })
    .then(() => {})
    .catch((error: Error) => console.error(error));
}
