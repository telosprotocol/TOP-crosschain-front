import React, { FunctionComponent, useEffect } from 'react';
import useSWR from 'swr';
import { observer } from 'mobx-react';
import { Loading, Layout, Dialog, Dialog2, Toast } from '@/components';
import FormatMessage from '@/locale/FormatMessage';
import useEX from './hook';
import '../Exchange/index.less';
import ReactTooltip from 'react-tooltip';
import {
  accuracy,
  ethAddressToTopT6,
  formatAddress,
  formatBalance,
  handleCopy,
} from '@/utils';
import { unCompletedTxlist } from '@/api';
import { stores } from '@/store';
import { addEthNetwork, addTopNetwork } from '@/store/chainStore';
import TxLoadingDialog from './TxLoadingDialog';
import { trackPV } from '@/api/track';

const exImgSrc = require('@/assets/images/home/ex.png');
const ethImgSrc = require('@/assets/images/home/eth.png');
const topImgSrc = require('@/assets/images/home/top.png');
const successImgSrc = require('@/assets/images/home/success.png');
const faqImgSrc = require('@/assets/images/home/faqImg.png');
const sousouImgSrc = require('@/assets/images/home/sousuo.png');

const torightImgSrc = require('@/assets/images/exchange/toright.png');
const toright2ImgSrc = require('@/assets/images/exchange/toright_2.png');
const todownImgSrc = require('@/assets/images/exchange/todown.png');
const selectImgSrc = require('@/assets/images/exchange/select.png');
const bscCoinImgSrc = require('@/assets/images/exchange/bsc.png');
const hescCoinImgSrc = require('@/assets/images/exchange/heco.png');
const swapImgSrc = require('@/assets/images/integrated/swap.png');
const questionImgSrc = require('@/assets/images/integrated/questioncircleoutlined.png');
const usdtImgSrc = require('@/assets/images/integrated/usdt.png');
const usdcImgSrc = require('@/assets/images/integrated/usdc.png');
const downCircleImgSrc = require('@/assets/images/integrated/down-circle.png');

const coinImgsMap = {
  ETH: ethImgSrc,
  BSC: bscCoinImgSrc,
  HECO: hescCoinImgSrc,
  TOP: topImgSrc,
  USDT: usdtImgSrc,
  USDC: usdcImgSrc,
};

const Exchange: FunctionComponent = () => {
  const {
    getLocaleMessage,
    amount,
    loading,
    handleChange,
    handleKeypress,
    handleAllIn,
    handleEX,
    handleTopToEthEX,
    handleConfirm,
    handleClose,
    address,
    account,
    balance,
    visible,
    ButtonDisable,
    coinType,
    coinTypesVisible,
    handleOpenCoinTypes,
    handleCloseCoinTypes,
    handleChangeCoinTypes,
    netShortName,
    selectCoinTypeList,
    walletConnect,
    poolAmount,
    handleUnLockClick,
    handleEthUnLockClick,
    loadingExtra,
    showExtractable,
    setShowExtractable,
    extractableObject,
    setExtractableObject,
    ethToTop,
    setEthToTop,
    setCoinType,
    maxMinValue,
    decimals,
    setChangeTopChainAddress,
    changeTopChainAddress,
    isEthNetwork,
    successEXTRACTABLE,
    showFaqDialog,
    setShowFaqDialog,
    currentTx,
    history,
    changeMetamaskDialog,
  } = useEX();

  function getUnCompletedBody() {
    if (
      !account ||
      !netShortName ||
      !walletConnect.account ||
      !walletConnect.netShortName
    ) {
      return null;
    }
    if (ethToTop) {
      return [
        {
          fromAddress: walletConnect.account,
          fromChainType: 'ETH',
          receiverAddress: account,
          toChainType: 'TOP',
        },
      ];
    } else {
      return [
        {
          fromAddress: account,
          fromChainType: 'TOP',
          receiverAddress: walletConnect.account,
          toChainType: 'ETH',
        },
      ];
    }
  }

  const { data, error } = useSWR(getUnCompletedBody(), unCompletedTxlist, {
    refreshInterval: 5000,
  });
  let unList: any = [];
  if (!error && data && data.message === 'OK') {
    unList = data.result || [];
    unList = unList.map(item => {
      let aggregationStatus = item.aggregationStatus;
      if (successEXTRACTABLE[item.transactionHash]) {
        aggregationStatus = 'SUCCESS';
      }
      return {
        ...item,
        aggregationStatus,
      };
    });
  }

  useEffect(() => {
    trackPV();
  }, []);

  return (
    <Layout>
      <div className="top-exchange top-integrated">
        <TxLoadingDialog />
        <div className="top-exchange-wrapper">
          <div
            className="top-exchange-des"
            // handleEthUnLockClick
            // handleUnLockClick
            // onClick={() =>
            //   handleUnLockClick(
            //     '0x713a0b15f7c784a36f4fca27848593c1d4ab303ce5be46c95255a4c44bf48563',
            //     'ETH'
            //   )
            // }
          >
            <div>
              An integrated cross-chain tool for multiple tokens.
              <br />
              You can perform cross-chain transactions of USDT, USDC, and ETH.
            </div>
            <div className="faq-btn-wrap">
              <div
                className="faq-btn"
                onClick={() => history.push('/browser?tab=2')}
              >
                <img src={sousouImgSrc} alt="" />
                <div>
                  Transaction
                  <br />
                  Tracker
                </div>
              </div>
              <div className="faq-btn" onClick={() => setShowFaqDialog(true)}>
                <img src={faqImgSrc} alt="" />
                <div>Fast FAQ</div>
              </div>
            </div>
          </div>

          <div className="top-exchange-box">
            <div className="top-integrated-box-left">
              <div className="top-integrated-from">
                <div className="top-integrated-from-chain">
                  From
                  {ethToTop ? (
                    <>
                      <img src={ethImgSrc} />
                      Ethereum
                    </>
                  ) : (
                    <>
                      <img src={topImgSrc} />
                      TOP
                    </>
                  )}
                </div>
                {ethToTop ? (
                  !changeTopChainAddress ? (
                    <>
                      <a
                        key="ethTip"
                        className="top-integrated-from-addr"
                        style={{ cursor: 'default' }}
                      >
                        {walletConnect.address}
                      </a>
                      {!walletConnect.address && (
                        <button
                          className="connect-other-wallets"
                          onClick={async () => {
                            changeMetamaskDialog(true);
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="connect-other-wallets"
                      onClick={async () => {
                        const res = await walletConnect.enable();
                        if (res) {
                          stores.chain.changeIsUseConnectWallet(true);
                          setChangeTopChainAddress(false);
                          await walletConnect.getAllInfos();
                        }
                      }}
                    >
                      Connect other wallets
                    </button>
                  )
                ) : (
                  <>
                    <a
                      key="topTip"
                      className="top-integrated-from-addr"
                      style={{ cursor: 'default' }}
                    >
                      {ethAddressToTopT6(address)}
                    </a>
                    {!address && (
                      <button
                        className="connect-other-wallets"
                        onClick={async () => {
                          changeMetamaskDialog(true);
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </>
                )}
              </div>
              <div
                className="top-eth-box top-eth-box2"
                style={{ borderRadius: '8px' }}
              >
                <div className="top-eth-item">
                  <div className="top-eth-left">Send</div>
                  <div className="top-eth-right text-soil">
                    <span
                      className="btn-link top-integrated-yellow"
                      onClick={handleAllIn}
                    >
                      Max: {balance}
                    </span>
                  </div>
                </div>
                <div className="top-eth-item ">
                  <div className="top-eth-left">
                    {/* <strong>{formatBalance(balance)}</strong> */}
                    <input
                      className="input-num"
                      type="number"
                      placeholder={getLocaleMessage('exchange.placeholder')}
                      onInput={handleChange}
                      onKeyPress={handleKeypress}
                      value={amount}
                    />
                  </div>
                  <div className="top-eth-right text-uint">
                    <div
                      className="top-eth-left top-eth-select"
                      onClick={handleOpenCoinTypes}
                    >
                      {coinType === 'BSC' && <img src={bscCoinImgSrc} alt="" />}
                      {coinType === 'HECO' && (
                        <img src={hescCoinImgSrc} alt="" />
                      )}
                      {coinType === 'TOP' && <img src={topImgSrc} alt="" />}{' '}
                      {coinType}{' '}
                      <img className="img-down" src={todownImgSrc} alt="" />
                    </div>
                    <div className="top-eth-right text-soil">
                      {/* <span>{formatAddress(topAddr)}</span> */}
                    </div>
                    {coinTypesVisible && (
                      <div className="pc-select">
                        {selectCoinTypeList.map(item => {
                          return (
                            <div
                              key={item}
                              className={coinType === item ? 'select' : ''}
                              onClick={() => handleChangeCoinTypes(item)}
                            >
                              {item}
                              {coinType === item && (
                                <img src={selectImgSrc} alt="" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="top-integrated-swap">
                <img
                  src={swapImgSrc}
                  onClick={() => {
                    setEthToTop(v => !v);
                  }}
                />
              </div>
              <div className="top-integrated-from">
                <div className="top-integrated-from-chain">
                  {ethToTop ? (
                    <>
                      To
                      <img src={topImgSrc} />
                      TOP
                    </>
                  ) : (
                    <>
                      To
                      <img src={ethImgSrc} />
                      Ethereum
                    </>
                  )}
                </div>
                <div className="top-integrated-from-addr">
                  {ethToTop ? (
                    <>
                      <a
                        key="topTip"
                        className="top-integrated-from-addr"
                        style={{ cursor: 'default' }}
                      >
                        {ethAddressToTopT6(address)}
                      </a>
                      {!address && (
                        <button
                          className="connect-other-wallets"
                          onClick={async () => {
                            changeMetamaskDialog(true);
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </>
                  ) : !changeTopChainAddress ? (
                    <>
                      <a
                        key="ethTip"
                        className="top-integrated-from-addr"
                        style={{ cursor: 'default' }}
                      >
                        {walletConnect.address}
                      </a>
                      {!walletConnect.address && (
                        <button
                          className="connect-other-wallets"
                          onClick={async () => {
                            changeMetamaskDialog(true);
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className="connect-other-wallets"
                      onClick={async () => {
                        const res = await walletConnect.enable();
                        if (res) {
                          stores.chain.changeIsUseConnectWallet(true);
                          setChangeTopChainAddress(false);
                          await walletConnect.getAllInfos();
                        }
                      }}
                    >
                      Connect other wallets
                    </button>
                  )}
                </div>
              </div>
              <div className="top-eth-box">
                <div className="top-eth-item">
                  <div>
                    Receive（estimated）
                    <img
                      data-tip=""
                      data-for="global"
                      data-event="click focus"
                      src={questionImgSrc}
                    />
                  </div>
                </div>
                <div className="top-eth-item">
                  <div
                    className="top-eth-left input-box"
                    style={{ overflow: 'hidden' }}
                  >
                    {amount || 0}
                    {/* <span onClick={handleAllIn}>MAX</span> */}
                  </div>
                  <div className="top-eth-right text-uint">
                    <img
                      src={coinImgsMap[coinType]}
                      style={{
                        marginRight: '6px',
                        width: '22px',
                        height: '22px',
                      }}
                    />{' '}
                    {coinType}
                  </div>
                </div>
              </div>
              <button
                className={
                  'ex-button ' + (ButtonDisable ? 'button-disable' : '')
                }
                onClick={handleConfirm}
              >
                {/* <FormatMessage id="exchange.exchange" /> */}
                Transfer
              </button>

              <ul className="exchange-ul">
                <li style={{ listStyle: 'none', marginLeft: '-15px' }}>
                  Notes
                </li>
                {!ethToTop && (
                  <>
                    <li>
                      Minimum cross-chain amount: over{' '}
                      {accuracy(maxMinValue[1], decimals, 6)} {coinType}.
                    </li>
                    <li>
                      Maximum cross-chain amount:{' '}
                      {accuracy(maxMinValue[0], decimals, 6)} {coinType}.
                    </li>
                  </>
                )}
                {/* <li>Cross-chain fee 1234 USDT.</li> */}
                <li>The estimated cross-chain time is 10~30 minutes.</li>
                <li>
                  For security reasons, large amount transactions may take up to
                  16 hours;
                </li>
              </ul>
            </div>
            <div className="top-integrated-box-right">
              <div className="top-integrated-header">
                Unfinished transactions
              </div>
              <table className="top-integrated-list">
                {unList.length === 0 && (
                  <tr
                    style={{
                      borderBottom: 'none',
                      height: '250px',
                    }}
                  >
                    <td style={{ textAlign: 'center' }}>No data</td>
                  </tr>
                )}
                {unList.map(item => {
                  return (
                    <tr key={item.transactionHash}>
                      <td>{item.tokenSymbol}</td>
                      <td>{formatBalance(item.amount)}</td>
                      <td>
                        <div>
                          From:{' '}
                          <span className="top-integrated-yellow">
                            {ethToTop
                              ? formatAddress(item.fromAddress)
                              : ethAddressToTopT6(
                                  formatAddress(item.fromAddress)
                                )}
                          </span>
                        </div>
                        <div>
                          To:{' '}
                          <span className="top-integrated-yellow">
                            {ethToTop
                              ? ethAddressToTopT6(
                                  formatAddress(item.receiverAddress)
                                )
                              : formatAddress(item.receiverAddress)}
                          </span>
                        </div>
                      </td>
                      <td>
                        {item.aggregationStatus === 'EXTRACTABLE' ? (
                          <span
                            className="EXTRACTABLE"
                            onClick={() => {
                              if (currentTx.from) {
                                Toast.prompt(
                                  'There is a transaction that has not been completed, please check it now!',
                                  5000,
                                  '',
                                  ''
                                );
                                return;
                              }
                              if (ethToTop) {
                                if (isEthNetwork) {
                                  // switch to top
                                  addTopNetwork();
                                  return;
                                }
                              } else {
                                if (!isEthNetwork) {
                                  // switch to top
                                  addEthNetwork();
                                  return;
                                }
                              }
                              setExtractableObject({ ...item });
                              setShowExtractable(true);
                            }}
                          >
                            Claim
                          </span>
                        ) : (
                          <div style={{ textAlign: 'center' }}>
                            <span>{item.aggregationStatus}</span>
                            <br />
                            <span
                              className="top-integrated-yellow"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                handleCopy(item.transactionHash);
                                Toast.success(getLocaleMessage('toast.copy'));
                              }}
                            >
                              Copy TxHash
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
        <Dialog
          visible={visible}
          handleClose={handleClose}
          handleClick={() => {
            if (ethToTop) {
              handleEX();
            } else {
              handleTopToEthEX();
            }
          }}
          title={'Cross-chain Confirmation'}
          button={
            <>
              {loading && <Loading />}
              {loading && <span style={{ paddingLeft: '5px' }} />}
              <FormatMessage
                id={`exchange.${loading ? 'loading' : 'buttonConfirm'}`}
              />
            </>
          }
        >
          <div className="confirm-dlg-item">
            <div className="top-dlg-box top-dlg-box1">
              <p>
                <span style={{ width: '45px' }}>From</span>{' '}
                {ethToTop ? (
                  <>
                    <img src={ethImgSrc} /> Ethereum
                  </>
                ) : (
                  <>
                    <img src={topImgSrc} /> TOP
                  </>
                )}
              </p>
              <p>
                <span style={{ width: '48px' }} />
                <img src={downCircleImgSrc} />
              </p>
              <p>
                <span style={{ width: '45px' }}>To</span>{' '}
                {ethToTop ? (
                  <>
                    <img src={topImgSrc} /> TOP
                  </>
                ) : (
                  <>
                    <img src={ethImgSrc} /> Ethereum
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="confirm-icc-content">
            <p>
              <span>You will receive</span>
              <span>
                {formatBalance(amount)} {coinType}
              </span>
            </p>
            {/* <p>
              <span>Fees</span>
              <span>0 {coinType}</span>
            </p> */}
            <p>
              <span>Destination</span>
              <span>
                {ethToTop ? ethAddressToTopT6(account) : walletConnect.account}
              </span>
            </p>
          </div>
        </Dialog>
        <Dialog
          visible={showExtractable}
          handleClose={() => setShowExtractable(false)}
          handleClick={() => {
            if (ethToTop) {
              handleUnLockClick(
                extractableObject.transactionHash,
                extractableObject.receiverToken
              );
            } else {
              handleEthUnLockClick(
                extractableObject.transactionHash,
                extractableObject.receiverToken
              );
            }
          }}
          title={'Confirm Cross'}
          button={
            <>
              {loadingExtra && <Loading />}
              {loadingExtra && <span style={{ paddingLeft: '5px' }} />}
              <FormatMessage
                id={`exchange.${loadingExtra ? 'loading' : 'buttonConfirm'}`}
              />
            </>
          }
        >
          <div className="confirm-dlg-item">
            <div className="top-dlg-box top-dlg-box1">
              <p>
                <span style={{ width: '45px' }}>From</span>{' '}
                {ethToTop ? (
                  <>
                    <img src={ethImgSrc} /> Ethereum
                  </>
                ) : (
                  <>
                    <img src={topImgSrc} /> TOP
                  </>
                )}
              </p>
              <p className="top-box1-address">
                <span style={{ width: '57px' }} />
                {ethToTop
                  ? extractableObject.fromAddress
                  : ethAddressToTopT6(extractableObject.fromAddress)}
              </p>
              <p>
                <span style={{ width: '48px' }} />
                <img src={downCircleImgSrc} />
              </p>
              <p>
                <span style={{ width: '45px' }}>To</span>{' '}
                {ethToTop ? (
                  <>
                    <img src={topImgSrc} /> TOP
                  </>
                ) : (
                  <>
                    <img src={ethImgSrc} /> Ethereum
                  </>
                )}
              </p>
              <p className="top-box1-address" style={{ color: '#888888' }}>
                <span style={{ width: '57px' }} />
                {ethToTop
                  ? ethAddressToTopT6(extractableObject.receiverAddress)
                  : extractableObject.receiverAddress}
              </p>
            </div>
          </div>
          <div className="confirm-icc-content">
            <p>
              <span>You will receive</span>
              <span>
                {formatBalance(extractableObject.amount)}{' '}
                {extractableObject.tokenSymbol}
              </span>
            </p>
            <p className="claim-your-assets">
              Your cross-chain assets have been successfully transferred to the
              ETH cross-chain contract, please manually claim your assets.
            </p>
          </div>
        </Dialog>
        <Dialog2
          wrapStyle={{ maxWidth: '886px', width: 'auto' }}
          visible={showFaqDialog}
          handleClose={() => setShowFaqDialog(false)}
          title={<div className="confirm-faq-h5">The bridge fast FAQ</div>}
        >
          <div className="confirm-faq">
            <div className="confirm-faq-scroll">
              <div className="confirm-faq-item">
                <div className="confirm-faq-title">
                  Cross-chain bridge known issues
                </div>
                <div className="confirm-faq-des">
                  <div className="confirm-faq-mb-10">
                    - The total amount of the TOP cross-chain transaction only
                    shows the transaction fee, not the cross-chain amount
                  </div>
                  <div>
                    - When TOP’s smart contract burns ETH token, Metamask only
                    display the transaction fee, not the burn value.
                  </div>
                </div>
              </div>
              <div className="confirm-faq-item">
                <div className="confirm-faq-title">User special tips</div>
                <div className="confirm-faq-des">
                  <div className="confirm-faq-mb-10">
                    - When you send cross-chain transactions with Metamask, the
                    transaction will be stuck in the sending state for a long
                    time, resulting in unsuccessful sending. The solution is as
                    follows: click the account icon in Metamask’s upper right
                    corner to enter the account list page, click Settings, and
                    then click Advanced to reset the account, then initiate
                    cross-chain transaction again.
                  </div>
                  <div>
                    - There may be a delay in updating or displaying cross-chain
                    transaction. You can wait after confirming that the
                    transaction is successful.
                  </div>
                </div>
              </div>
              <div className="confirm-faq-item">
                <div className="confirm-faq-title">
                  The following vulnerabilities are excluded from the rewards
                  for this bug bounty program
                </div>
                <div className="confirm-faq-des">
                  <div className="confirm-faq-mb-10">
                    - Previously known vulnerabilities (resolved or not) on the
                    TOP network (and any other fork of these).
                  </div>

                  <div className="confirm-faq-mb-10">
                    - Feature request {'&'} Best practice
                  </div>
                  <div className="confirm-faq-mb-10">
                    - Attacks requiring privileged access from within the
                    organization
                  </div>
                  <div className="confirm-faq-mb-10">
                    - Vulnerabilities only exploitable on out-of-date browsers
                    or platforms
                  </div>
                  <div className="confirm-faq-mb-10">
                    - Vulnerabilities requiring unlikely user actions
                  </div>
                  <div className="confirm-faq-mb-10">- Page compatibility</div>
                </div>
              </div>
            </div>
            <div>
              <button
                style={{ width: '136px', margin: 'auto' }}
                className="top-dailog-button"
                onClick={() => setShowFaqDialog(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </Dialog2>
      </div>

      {coinTypesVisible ? (
        <div className="transp-dlg">
          <div className="transp-bg" onClick={handleCloseCoinTypes} title={''}>
            &nbsp;
          </div>
          <div className="transp-cont">
            {selectCoinTypeList.map(item => {
              return (
                <p key={item} onClick={() => handleChangeCoinTypes(item)}>
                  <img src={coinImgsMap[item]} alt="" />
                  <span className="coin-name">{item}</span>
                  {coinType === item ? <img src={selectImgSrc} alt="" /> : ''}
                </p>
              );
            })}
          </div>
        </div>
      ) : (
        ''
      )}

      <ReactTooltip id="global" globalEventOff="click">
        This amount is estimated based on
        <br />
        the current bridge rate and fees.
      </ReactTooltip>
      {!stores.chain.isUseConnectWallet && (
        <>
          {/* <ReactTooltip
            id="ethTip"
            effect="solid"
            clickable={true}
            delayHide={300}
          >
            If you need to use a different address, you need
            <br />
            to connect to{' '}
            <span
              onClick={async () => {
                const res = await walletConnect.enable();
                if (res) {
                  stores.chain.changeIsUseConnectWallet(true);
                  setChangeTopChainAddress(false);
                  await walletConnect.getAllInfos();
                }
              }}
              className="icc-underline"
            >
              a second plugin wallet{'>>'}
            </span>
            .
          </ReactTooltip> */}
          {/* <ReactTooltip
            id="topTip"
            effect="solid"
            clickable={true}
            delayHide={300}
          >
            Switch both addresses on Metamask, otherwise
            <br />
            only{' '}
            <span
              onClick={() => setChangeTopChainAddress(true)}
              className="icc-underline"
            >
              change the TOP chain address{'>>'}?
            </span>
            .
          </ReactTooltip> */}
        </>
      )}
    </Layout>
  );
};

export default observer(Exchange);
