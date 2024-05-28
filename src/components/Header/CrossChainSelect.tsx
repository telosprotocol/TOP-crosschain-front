import {
  addBSCNetwork,
  addEthNetwork,
  addTopNetwork,
} from '@/store/chainStore';
import { ethAddressToTopT6 } from '@/utils';
import { MobXProviderContext } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react';

import { useClickAway } from 'react-use';

const ethImgSrc = require('@/assets/images/home/eth.png');
const topImgSrc = require('@/assets/images/home/top.png');
const bscCoinImgSrc = require('@/assets/images/exchange/bsc.png');
const hescCoinImgSrc = require('@/assets/images/exchange/heco.png');
const todownImgSrc = require('@/assets/images/exchange/todown.png');

const walletSrc = require('@/assets/images/integrated/wallet.png');
const sjxSrc = require('@/assets/images/integrated/sjx.png');

function CrossChainSelect() {
  const {
    chain: {
      isEthNetwork,
      isTOPNetwork,
      address,
      changeMetamaskDialog,
      netId,
      disconnect,
      isRightNetwork,
      isUseConnectWallet,
    },
    walletConnect,
  } = useContext(MobXProviderContext);

  console.log('walletConnectStore', walletConnect);

  const [showSelect, setShowSelect] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => {
    setShowSelect(false);
  });

  let topConnectContent = (
    <span onClick={() => changeMetamaskDialog(true)}>Connect</span>
  );

  if (netId === '-1') {
    topConnectContent = (
      <span onClick={() => changeMetamaskDialog(true)}>Connect</span>
    );
  } else {
    if (isUseConnectWallet) {
      if (!isTOPNetwork) {
        topConnectContent = (
          <span onClick={() => addTopNetwork()}>Connect</span>
        );
      } else {
        topConnectContent = (
          <span
            className="CrossChainSelect-Disconnect"
            onClick={async () => {
              await disconnect();
            }}
          >
            Disconnect
          </span>
        );
      }
    } else {
      if (isTOPNetwork || isEthNetwork) {
        if (isTOPNetwork) {
          topConnectContent = (
            <span
              className="CrossChainSelect-Disconnect"
              onClick={async () => {
                await disconnect();
              }}
            >
              Disconnect
            </span>
          );
        }
        if (isEthNetwork) {
          topConnectContent = (
            <span onClick={() => addTopNetwork()}>Switch</span>
          );
        }
      } else {
        topConnectContent = (
          <span onClick={() => addTopNetwork()}>Connect</span>
        );
      }
    }
  }

  let ethConnectContent = (
    <span onClick={() => changeMetamaskDialog(true)}>Connect</span>
  );
  if (isUseConnectWallet) {
    if (walletConnect.netId === '-1') {
      ethConnectContent = (
        <span
          onClick={async () => {
            await walletConnect.enable();
            await walletConnect.getAllInfos();
          }}
        >
          Connect
        </span>
      );
    } else {
      if (walletConnect.isEthNetwork) {
        ethConnectContent = (
          <span
            className="CrossChainSelect-Disconnect"
            onClick={async () => {
              await walletConnect.disconnect();
            }}
          >
            Disconnect
          </span>
        );
      } else {
        ethConnectContent = (
          <span
            onClick={async () => {
              await walletConnect.disconnect();
            }}
          >
            Connect
          </span>
        );
      }
    }
  } else {
    if (netId === '-1') {
      ethConnectContent = (
        <span onClick={() => changeMetamaskDialog(true)}>Connect</span>
      );
    } else {
      if (isTOPNetwork || isEthNetwork) {
        if (isTOPNetwork) {
          ethConnectContent = (
            <span onClick={() => addEthNetwork()}>Switch</span>
          );
        }
        if (isEthNetwork) {
          ethConnectContent = (
            <span
              className="CrossChainSelect-Disconnect"
              onClick={async () => {
                await disconnect();
              }}
            >
              Disconnect
            </span>
          );
        }
      } else {
        ethConnectContent = (
          <span onClick={() => addEthNetwork()}>Connect</span>
        );
      }
    }
  }

  return (
    <div className="CrossChainSelect" ref={ref}>
      <div
        className="CrossChainSelect-line"
        onClick={() => setShowSelect(!showSelect)}
      >
        {/* <div className="CrossChainSelect-l1">
          <img className="CrossChainSelect-logo" src={walletSrc} />
          Wallet
          <img className="CrossChainSelect-logo" src={sjxSrc} />
        </div> */}
        {/* <div className="CrossChainSelect-l1">
          <div className="CrossChainSelect-onechain">
            <img src={topImgSrc} />
            <div className="CrossChainSelect-text">0xE5a4....48bd36</div>
          </div>
          <img className="CrossChainSelect-logo" src={sjxSrc} />
        </div> */}
        <div className="CrossChainSelect-l1">
          <div className="CrossChainSelect-twochain">
            <img src={ethImgSrc} />
            <img src={topImgSrc} />
          </div>
          <img
            className={
              showSelect
                ? 'CrossChainSelect-logo '
                : 'CrossChainSelect-logo showSelect'
            }
            src={sjxSrc}
          />
        </div>
      </div>
      {showSelect && (
        <div className="CrossChainSelect-list">
          <div className="CrossChainSelect-item">
            <div>
              <img src={topImgSrc} />
              <div>
                <div className="CrossChainSelect-text">TOP</div>
                {address && (
                  <div className="CrossChainSelect-text">
                    {ethAddressToTopT6(address)}
                  </div>
                )}
              </div>
            </div>
            {topConnectContent}
          </div>
          <div className="CrossChainSelect-item">
            <div>
              <img src={ethImgSrc} />
              <div>
                <div className="CrossChainSelect-text">Ethereum</div>
                <div className="CrossChainSelect-text">
                  {walletConnect.address}
                </div>
              </div>
            </div>
            {ethConnectContent}
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(CrossChainSelect);
