import React, {
  FunctionComponent,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { observer, MobXProviderContext } from 'mobx-react';
import { Toast, Layout, Dialog } from '@/components';
import FormatMessage from '@/locale/FormatMessage';
import { useHistory } from 'react-router-dom';
import './index.less';
import { trackPV } from '@/api/track';

const Home: React.FunctionComponent = () => {
  const {
    locale: { getLocaleMessage, lan },
    chain: { enable, account, bindTOP },
  } = useContext(MobXProviderContext);
  const history = useHistory();
  const handleClick = useCallback(() => {
    history.push('/exchange');
  }, [account]);
  const buttonView = useMemo(
    () => (account ? 'home.goExchange' : 'home.content'),
    [account]
  );
  const [noticeVisible, setNoticeVisible] = useState(false);

  const pcWalletConnectImgSrc = require('@/assets/images/home/pc_con.png');
  const mbWalletConnectImgSrc = require('@/assets/images/home/mb_con.png');
  
  useEffect(() => {
    trackPV();
  }, []);

  return (
    <Layout>
      <div className="top-home">
        <div className="top-home-wrapper">
          <h1 className="site-title">TOP Cross-chain Bridge</h1>
          <div className="top-home-desc">
            Welcome to TOP Bridge, you can swap your ERC-20 TOP and mainnet TOP
            here.
            <br />
            - For ERC-20 TOP, you can swap it to the BSC or Heco chain. Note
            that this is currently a one-way swapping.
            <br />- You can make any swap between mainnet TOP, BSC TOP, and HECO
            TOP. Note that, to swap mainnet TOP to BSC or HECO TOP, please go to
            HiWallet.
          </div>
          <div className="top-home-desc1">
            <b>The procedure is as follows:</b>
            <ul>
              <li>
                <span className="serial-no">1</span>Connect to your MetaMask wallet
              </li>
              <li>
                <span className="serial-no">2</span>Select the chain you want to swap to
              </li>
              <li>
                <span className="serial-no">3</span>Enter the amount of tokens you want to swap
              </li>
              <li>
                <span className="serial-no">4</span>Start swapping
              </li>
              <li>
                <span className="serial-no">5</span>Wait for the swapping to complete
              </li>
            </ul>
          </div>
          <ul className="top-home-desc2">
            <li>Minimum transaction amount 5000 TOP.</li>
            <li>
              The estimated cross-chain transaction time is 10-30 minutes.
            </li>
            <li>
              For security purposes, cross-chain transactions with larger amount
              (over 1,000,000,000 TOP) may take up to 12 hours.
            </li>
            <li>
              You can perform cross-chain transfers of TOP mainnet tokens in
              HiWallet.
            </li>
          </ul>
          <button className="home-button" onClick={handleClick}>
            <b>Understood, next</b>
          </button>
        </div>
      </div>
      <div className="mb-btn-panel">
        <button className="home-button" onClick={handleClick}>
          <b>Understood, next</b>
        </button>
      </div>
      <Dialog
        visible={noticeVisible}
        handleClose={() => setNoticeVisible(false)}
        handleClick={() => setNoticeVisible(false)}
        title={''}
      >
        <div>
          <div className="home-pc-notice">
            <p className="notice-icon">
              <img src={pcWalletConnectImgSrc} alt="" />
            </p>
            <p className="notice-title">MetaMask</p>
            <p className="notice-desc">connect to your MetaMask Wallet</p>
          </div>
          <div className="home-mb-notice">
            <p className="notice-icon">
              <img src={mbWalletConnectImgSrc} alt="" />
            </p>
            <p className="notice-title">WalletConnect</p>
            <p className="notice-desc">Scan with WalletConnect to connect</p>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
};

export default observer(Home);
