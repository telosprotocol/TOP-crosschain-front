import { observable, action, makeObservable } from 'mobx';
import {
  ETHEREUM_STORAGE_KEY,
  getEthereum,
  getWeb3,
  isDev,
  IS_CONNECT_STORAGE_KEY,
} from '@/eth';
import { getTokenInfo } from '@/eth/method';
import { accuracy, formatAddress } from '@/utils';
import { Toast } from '@/components';
import { receiveAddress, token } from '@/api';
import { stores } from '..';
import { getTopTokenInfo, transAddress } from '@/top/method';
import { topRpc } from '@/eth/queryWeb3';
import { ETH_CHAIN_ID, TOP_CHAIN_ID } from '@/config';

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
  '1023': 'TOP-testnet',
  '980': 'TOP',
  '20212': 'ZSC',
  '1555': 'Eth test network',
  '1255': 'Eth test network',
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
  '1255': 'Eth test network',
  '11155111': 'ETH',
};

export function getIsUseConnectWallet() {
  return (localStorage.getItem('_isUseConnectWallet') || '0') === '1';
}

export default class ChainStore {
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

  @observable
  isUseConnectWallet = getIsUseConnectWallet();

  @observable
  metamaskDialog = false;

  @observable
  currentTx = {
    from: '',
  };

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

  get isTOPNetwork() {
    return this.netId === TOP_CHAIN_ID;
  }

  get isRightNetwork() {
    if (this.isUseConnectWallet) {
      return this.isTOPNetwork;
    } else {
      return this.isEthNetwork || this.isTOPNetwork;
    }
  }

  @action.bound
  public changeCurrentTx(tx) {
    this.currentTx = tx;
  }

  @action.bound
  public changeIsUseConnectWallet(b) {
    this.isUseConnectWallet = b;
    localStorage.setItem('_isUseConnectWallet', b ? '1' : '0');
  }

  @action.bound
  public changeMetamaskDialog(b) {
    this.metamaskDialog = b;
  }

  @action.bound
  public async toogleAccount() {
    console.log('toogleAccount');
    const ethereum = getEthereum();
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const [account] = accounts;
    this.account = account;
    this.toogleTokenInfo();
    localStorage.setItem('_account', this.account);
  }

  @action.bound
  public async toogleNetwork() {
    console.log('toogleNetwork');
    const ethereum = getEthereum();
    const chainId = await ethereum.request({
      method: 'eth_chainId',
    });
    console.log('chainId', chainId);
    const netId = parseInt(chainId, 16) + '';
    this.netId = netId;
    this.netName = NETWORKS[netId];
    this.getToken(netId);
    this.getReceiveAddress();
    localStorage.setItem('_netId', this.netId);
    localStorage.setItem('_netName', this.netName || '');
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
      const { balance, decimals } = await getTokenInfo(this.account, token);
      console.log('getTokenInfo', this.account, token, balance);
      this.decimals = Number(decimals);
      this.balanceAll = accuracy(balance, this.decimals, this.decimals, true);
      this.balance = accuracy(balance, this.decimals, 8);
    } catch (error) {
      console.log('toogleTokenInfo', error);
      this.balance = 0;
      this.balanceAll = '0';
    }
  }

  @action.bound
  async getAllInfos() {
    await this.toogleAccount();
    await this.toogleNetwork();
    if (!this.isUseConnectWallet) {
      stores.walletConnect.useOneWallet({
        netId: this.netId,
        account: this.account,
        chainId: this.chainId,
      });
    }
  }

  @action.bound
  public async enable(type: string) {
    try {
      localStorage.setItem(ETHEREUM_STORAGE_KEY, type);
      const ethereum = getEthereum();

      if (!ethereum) {
        if (type === 'topia') {
          window.open('https://www.topiawallet.io/', 'blank');
        } else {
          window.open('https://metamask.io/', 'blank');
        }
        return '';
      }
      await this.getAllInfos();
      localStorage.setItem(IS_CONNECT_STORAGE_KEY, '1');
      return this.netId;
    } catch (e) {
      Toast.fail(stores.locale.getLocaleMessage('toast.contentFail'));
      console.log('enable');
      return '';
    }
  }

  @action.bound
  public async disconnect() {
    this.netId = '-1';
    this.chainId = '';
    this.netName = 'Unknow';
    this.account = '';
    this.balance = 0;
    this.balanceAll = '0';
    this.decimals = 18;
    if (!this.isUseConnectWallet) {
      stores.walletConnect.useOneWallet({
        netId: '-1',
        account: '',
        chainId: '',
      });
    }
    localStorage.setItem(IS_CONNECT_STORAGE_KEY, '0');
  }

  @action.bound
  public async getToken(netId) {
    if (this.token) {
      return this.token;
    }
    if (!netId || netId === '-1' || netId === 'TOP') {
      return '';
    }
    return ''
  }
  @action.bound
  public async getReceiveAddress() {
    if (!this.netId || this.netId === '-1' || this.receiveAddress) {
      return '';
    }
    return ''
  }
}

export async function wallet_watchAsset() {
  const tokenAddress = '0x16De6497292ca52D10038c641BD1d518113a51Dc';
  const tokenSymbol = 'TOP';
  const tokenDecimals = 18;
  const tokenImage = 'https://www.topnetwork.org/static/images/top.png';

  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const ethereum = getEthereum();
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: tokenAddress, // The address that the token is at.
          symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: tokenDecimals, // The number of decimals in the token
          image: tokenImage, // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Your loss!');
    }
  } catch (error) {
    console.log(error);
  }
}

export async function addEthNetwork() {
  return switchToChain('0x'+Number(ETH_CHAIN_ID).toString(16), 'Ethereum', '');
}

export async function addBSCNetwork() {}

export async function addTopNetwork() {
  return switchToChain(
    '0x' + Number(TOP_CHAIN_ID).toString(16),
    'TOP Mainnet EVM',
    topRpc
  );
}

export async function switchToChain(
  toChainIdHex: string,
  toChainName: string,
  toChainRpc: string
) {
  const ethereum = getEthereum();
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: toChainIdHex,
        },
      ],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as any).code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: toChainIdHex,
              chainName: toChainName,
              rpcUrls: [toChainRpc],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
        return true;
      } catch (addError) {
        // handle "add" error
        return false;
      }
    } else {
      return false;
    }
    // handle other "switch" errors
  }
}
