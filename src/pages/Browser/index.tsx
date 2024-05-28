import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import {
  formatAddress,
  formatTime1,
  accuracy,
  openBrowser,
  ethAddressToTopT6,
  djs,
  formatBalance,
} from '@/utils';
import { getTransactionReceipt } from '@/api';
import FormatMessage from '@/locale/FormatMessage';
import { Toast, Layout } from '@/components';
import useRecord from './hook';
import './index.less';
import Pagination from '@/components/Pagination';

import { Tabs, Row, Col, Input, Select } from 'antd';
import { trackPV } from '@/api/track';

const { TabPane } = Tabs;
const { Option } = Select;

const empty = require('@/assets/images/home/empty.png');

const bscCoinImgSrc = require('@/assets/images/exchange/bsc.png');
const hescCoinImgSrc = require('@/assets/images/exchange/heco.png');
const jiantouhuiImgSrc = require('@/assets/images/integrated/jiantouhui.png');
const jiantouheiImgSrc = require('@/assets/images/integrated/jiantouhei.png');
const successImgSrc = require('@/assets/images/integrated/success.png');
const errorImgSrc = require('@/assets/images/integrated/error.png');
const pendingImgSrc = require('@/assets/images/integrated/pending.png');
const sanjiaoImgSrc = require('@/assets/images/integrated/sanjiao.png');
const ethImgSrc = require('@/assets/images/home/eth.png');

const Record: React.FunctionComponent = () => {
  const {
    record,
    goBack,
    getStatus,
    current,
    total,
    onChange,
    hecoCon,
    bscCon,
    ethCon,
    hecoAmount,
    bscAmount,
    ethAmount,
    realCurrent,
  } = useRecord();

  const [details, setDetails] = useState<any>({});
  const [hash, setHash] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    if (window.location.search.indexOf('tab=2') > -1) {
      setActiveKey('2');
    }
  }, []);

  async function handleClick() {
    if (!hash) {
      Toast.fail('Please input transaction hash.');
      return;
    }
    setLoading(true);
    setDetails({});
    try { 
      const res = await getTransactionReceipt(hash);
      setDetails(res.result);
    } catch (error) {
      const message = (error as any).message;
      if (message === 'hash') {
        Toast.fail('Hash not exists');
      } else {
        Toast.fail(message);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    trackPV();
  }, []);

  return (
    <Layout>
      <div className="top-browser">
        <div className="top-record-wrap">
          <div className="top-total-wrap" style={{ display: 'none' }}>
            <div className="top-total">
              <div className="top-item">
                <div className="top-t1">
                  <img className="browser-top-image" src={ethImgSrc} />
                  Destroyed on ETH (TOP)
                </div>
                <div className="top-t2">{ethAmount}</div>
                <div className="top-t3">
                  ETH Contract：
                  <a onClick={() => openBrowser(ethCon, 'ETH')}>
                    {formatAddress(ethCon)}
                  </a>
                </div>
              </div>
              <div className="t-line" />
              <div className="top-item">
                <div className="top-t1">
                  <img className="browser-top-image" src={bscCoinImgSrc} />
                  Total Inbound Assets（TOP）
                </div>
                <div className="top-t2">{accuracy(bscAmount, 0, 8)}</div>
                <div className="top-t3">
                  BSC Contract：
                  <a onClick={() => openBrowser(hecoCon, 'BSC')}>
                    {formatAddress(bscCon)}
                  </a>
                </div>
              </div>
              <div className="t-line" />
              <div className="top-item">
                <div className="top-t1">
                  <img className="browser-top-image" src={hescCoinImgSrc} />
                  Total Inbound Assets（TOP）
                </div>
                <div className="top-t2">{accuracy(hecoAmount, 0, 8)}</div>
                <div className="top-t3">
                  HECO Contract：
                  <a onClick={() => openBrowser(hecoCon, 'HECO')}>
                    {formatAddress(hecoCon)}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="browser-title">Transaction record</div>
          <Tabs
            activeKey={activeKey}
            type="card"
            onChange={k => setActiveKey(k)}
          >
            <TabPane
              tab="View Txns"
              key="1"
              style={{ backgroundColor: '#ffffff' }}
            >
              {record.length ? (
                <>
                  <div className="record-table">
                    <div className="record-table-item record-table-thead">
                      <div className="table-item-left">Number</div>
                      <div className="table-item-center">Tokens</div>
                      <div className="table-item-center">Quantity</div>
                      <div className="table-item-center table-flex">
                        Send<span style={{ padding: '0 80px' }}>{''}</span>
                      </div>
                      <div className="table-item-center">Received</div>
                      <div className="table-item-center">
                        <FormatMessage id="record.time" />
                      </div>
                      <div className="table-item-right">
                        {/* <FormatMessage id="record.status" /> */}
                        State
                      </div>
                    </div>
                    <div className="record-table-box">
                      {record.map(
                        (
                          {
                            createdDate,
                            amount,
                            gasFee,
                            transferStatus,
                            sourceChain,
                            toChain,
                            address,
                            receiveAddress,
                            sourceSymbol,
                          },
                          index
                        ) => {
                          const statu = getStatus({ transferStatus });
                          return (
                            <div className="record-table-item" key={index}>
                              <div className="table-item-left">
                                {index + 1 + (realCurrent - 1) * 10}
                              </div>
                              <div className="table-item-center">
                                {sourceSymbol}
                              </div>
                              <div className="table-item-center">
                                <span className="mb6">
                                  Sent：{accuracy(amount, 0, 8)}
                                </span>
                                <br />
                                <span>
                                  Received:{' '}
                                  {transferStatus === 'SUCCESS'
                                    ? accuracy(amount, 0, 8)
                                    : '--'}
                                </span>
                              </div>
                              <div className="table-item-center table-flex">
                                <div>
                                  <span className="mb6">{sourceChain}</span>
                                  <br />
                                  <a
                                  // onClick={() =>
                                  //   openBrowser(address, sourceChain)
                                  // }
                                  >
                                    {sourceChain === 'TOP'
                                      ? ethAddressToTopT6(
                                          formatAddress(address)
                                        )
                                      : formatAddress(address)}
                                  </a>
                                </div>
                                <div>{'>>'}</div>
                              </div>
                              <div className="table-item-center">
                                <div>
                                  <span className="mb6">{toChain}</span>
                                  <br />
                                  <a
                                  // onClick={() =>
                                  //   openBrowser(receiveAddress, toChain)
                                  // }
                                  >
                                    {toChain === 'TOP'
                                      ? ethAddressToTopT6(
                                          formatAddress(receiveAddress)
                                        )
                                      : formatAddress(receiveAddress)}
                                  </a>
                                </div>
                                <div>{''}</div>
                              </div>
                              <div className="table-item-center">
                                {formatTime1(createdDate)}
                              </div>
                              <div
                                className={
                                  'table-item-right ' + 'record-' + statu
                                }
                              >
                                {statu}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                  <div className="record-table-m">
                    {record.map(
                      (
                        {
                          createdDate,
                          amount,
                          gasFee,
                          transferStatus,
                          sourceChain,
                          toChain,
                          address,
                          receiveAddress,
                        },
                        index
                      ) => {
                        const statu = getStatus({ transferStatus });
                        return (
                          <div className="table-m-item" key={index}>
                            <div className="table-m-line">
                              <span className="m-time">
                                {formatTime1(createdDate)}
                              </span>
                              <span className={'m-status ' + 'record-' + statu}>
                                {/* <FormatMessage id={`record.${statu}`} /> */}
                                {statu}
                              </span>
                            </div>
                            <div className="table-m-line  table-m-line2">
                              <span className="m-uint browser-Quantity">
                                Quantity
                              </span>
                              <div className="browser-received">
                                <div>Sent: {accuracy(amount, 0, 8)}</div>
                                <div>
                                  Received:{' '}
                                  {transferStatus === 'SUCCESS'
                                    ? accuracy(amount, 0, 8)
                                    : '--'}
                                </div>
                              </div>
                            </div>
                            <div className="table-m-line table-m-line3">
                              <div>
                                <div>{sourceChain}</div>
                                <div>
                                  <a
                                  // onClick={() =>
                                  //   openBrowser(address, sourceChain)
                                  // }
                                  >
                                    {sourceChain === 'TOP'
                                      ? ethAddressToTopT6(
                                          formatAddress(address)
                                        )
                                      : formatAddress(address)}
                                  </a>
                                </div>
                              </div>
                              <div>{'>>'}</div>
                              <div>
                                <div>{toChain}</div>
                                <div>
                                  <a
                                  // onClick={() =>
                                  //   openBrowser(receiveAddress, toChain)
                                  // }
                                  >
                                    {toChain === 'TOP'
                                      ? ethAddressToTopT6(
                                          formatAddress(receiveAddress)
                                        )
                                      : formatAddress(receiveAddress)}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={10}
                    onChange={onChange}
                  />
                </>
              ) : (
                <div className="record-empty">
                  <img src={empty} alt="empty" />
                  <FormatMessage id="record.empty" />
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default observer(Record);

function calGasUnit({ methodName }) {
  if (methodName === 'lock' || methodName === 'unclock') {
    return 'ETH';
  } else {
    return 'TOP';
  }
}

function calAction({
  methodName,
  tokenSymbol,
  amount,
  fromAddress,
  receiverAddress,
}) {
  if (methodName === 'lock') {
    return `LockToken From ${fromAddress.substring(
      0,
      22
    )}… To ${receiverAddress.substring(0, 22)}… For ${amount} ${tokenSymbol}`;
  }
  if (methodName === 'unclock') {
    return `ClaimToken From ${fromAddress.substring(
      0,
      22
    )}… To ${receiverAddress.substring(0, 22)}… For ${amount} ${tokenSymbol}`;
  }
  if (methodName === 'claim') {
    return `ClaimToken From ${fromAddress.substring(
      0,
      22
    )}… To ${receiverAddress.substring(0, 22)}… For ${amount} ${tokenSymbol}`;
  }
  if (methodName === 'burn') {
    return `Burn From ${fromAddress.substring(
      0,
      22
    )}… To ${receiverAddress.substring(0, 22)}… For ${amount} ${tokenSymbol}`;
  }
  return '';
}

function calTopText({ methodName }) {
  if (methodName === 'lock') {
    return (
      <>
        <img src={jiantouheiImgSrc} alt="" />
        <img src={jiantouhuiImgSrc} alt="" />
        <span className="span1">Lock to pool</span>
        <span className="span2">Claim token</span>
      </>
    );
  }
  if (methodName === 'unclock') {
    return (
      <>
        <img src={jiantouhuiImgSrc} alt="" />
        <img src={jiantouheiImgSrc} alt="" />
        <span className="span1" style={{ color: '#000' }}>Burn tokens</span>
        <span className="span2" style={{ color: '#fff' }}>
          Claim from pool
        </span>
      </>
    );
  }
  if (methodName === 'claim') {
    return (
      <>
        <img src={jiantouhuiImgSrc} alt="" />
        <img src={jiantouheiImgSrc} alt="" />
        <span className="span1" style={{ color: '#000' }}>
          Lock to pool
        </span>
        <span className="span2" style={{ color: '#fff' }}>
          Claim token
        </span>
      </>
    );
  }
  if (methodName === 'burn') {
    return (
      <>
        <img src={jiantouheiImgSrc} alt="" />
        <img src={jiantouhuiImgSrc} alt="" />
        <span className="span1">Burn tokens</span>
        <span className="span2">Claim from pool</span>
      </>
    );
  }
  return '';
}
