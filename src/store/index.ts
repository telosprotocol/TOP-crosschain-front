import Locale from './localeStore';
import Chain from './chainStore';
import WalletConnect from './walletConnectStore';

const locale = new Locale();
const chain = new Chain();
const walletConnect = new WalletConnect();
const stores = { locale, chain, walletConnect };
window.stores = stores;
export { stores };
