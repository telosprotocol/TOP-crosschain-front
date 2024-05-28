import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Header, Dialog, Toast } from '@/components';
import Routes from './routes';
import { MobXProviderContext, observer } from 'mobx-react';
import { HashRouter } from 'react-router-dom';
import { stores } from './store';
import {
  ETHEREUM_STORAGE_KEY,
  getEthereum,
  getWeb3,
  isDev,
  IS_CONNECT_STORAGE_KEY,
} from './eth';
import { addEthNetwork, getIsUseConnectWallet } from './store/chainStore';
import { initTrack } from './api/track';
import { ETH_CHAIN_ID, TOP_CHAIN_ID } from './config';
const pcWalletConnectImgSrc = require('@/assets/images/home/pc_con.png');
const topiaImgSrc = require('@/assets/images/topialogo128.png');

function initAccountChangeEvent() {
  const ethereum = getEthereum();
  if (ethereum && typeof ethereum.on === 'function') {
    ethereum.on('accountsChanged', () => window.location.reload());
    ethereum.on('chainChanged', () => window.location.reload());
  }
}

const App: React.FunctionComponent = () => {
  const {
    chain: { enable, getAllInfos, metamaskDialog, changeMetamaskDialog },
    locale: { getLocaleMessage },
    walletConnect,
  } = useContext(MobXProviderContext);
  const handleClose = () => {
    changeMetamaskDialog(false);
  };
  const handleVisible = () => {
    changeMetamaskDialog(true);
  };

  const init = async () => {
    async function innerEnable() {
      const isConnect = localStorage.getItem(IS_CONNECT_STORAGE_KEY) || '0';
      const type = localStorage.getItem(ETHEREUM_STORAGE_KEY) || '';

      if (isConnect === '1' && type && type !== 'undefined') {
        const res = await enable(type);
        if (res) {
          initAccountChangeEvent();
        }
      }
    }

    innerEnable();
  };
  useEffect(() => {
    setTimeout(() => {
      init();
    }, 300);
    const inter = setInterval(() => getAllInfos(), 500000000 * 1000);
    return () => {
      if (inter) {
        clearInterval(inter);
      }
    };
  }, []);

  useEffect(() => {
    initTrack({
      appname: 'TopBridge',
      category: 'website',
      baseUrl: '',
    });
  }, []);

  return (
    <>
      <HashRouter key="Router">
        <Routes />
      </HashRouter>

      <Toast key="Toast" />

      <Dialog
        visible={metamaskDialog}
        handleClose={handleClose}
        handleClick={handleVisible}
        title={''}
      >
        <div style={{ marginTop: '-24px' }}>
          <div className="home-notice">
            <p className="notice-title">Select your wallet</p>
            <p className="notice-icon">
              <img src={pcWalletConnectImgSrc} alt="" />
              <button
                className="connect-button"
                onClick={async () => {
                  const res = await enable('metamask');
                  if (res !== ETH_CHAIN_ID && res !== TOP_CHAIN_ID) {
                    addEthNetwork();
                  }
                  if (res) {
                    changeMetamaskDialog(false);
                    initAccountChangeEvent();
                  }
                }}
              >
                MetaMask
              </button>
            </p>
            <p className="notice-icon">
              <img src={topiaImgSrc} alt="" />
              <button
                className="connect-button"
                onClick={async () => {
                  const res = await enable('topia');
                  if (res !== ETH_CHAIN_ID && res !== TOP_CHAIN_ID) {
                    addEthNetwork();
                  }
                  if (res) {
                    changeMetamaskDialog(false);
                    initAccountChangeEvent();
                  }
                }}
              >
                Topia
              </button>
            </p>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default observer(App);
