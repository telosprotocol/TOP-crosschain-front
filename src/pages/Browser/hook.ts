import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MobXProviderContext } from 'mobx-react';
import {
  allTransfer,
  config,
  receiveAddress,
  token,
  receiveAddressErc20,
  bscTotalInboundAssets,
  hecoTotalInboundAssets,
} from '@/api';
import { useHistory } from 'react-router-dom';
import { accuracy } from '@/utils';

const useRecord = () => {
  const {
    locale: { getLocaleMessage },
    chain: { account },
  } = useContext(MobXProviderContext);
  const history = useHistory();
  const [record, setRecord]: any = useState([]);

  const [current, setCurrent] = useState(1);
  const [realCurrent, setRealCurrent] = useState(1);
  const [total, setTotal] = useState(10);

  const goBack = () => history.go(-1);
  useEffect(() => {
    allTransfer({
      pageIndex: current,
      pageSize: 10,
      // sourceChain: 'ETH',
    }).then((res: any) => {
      if (res && Array.isArray(res.result)) {
        setRecord(res.result);
        setTotal(res.totalCount);
        setRealCurrent(current);
      }
    });
  }, [account, current]);

  const [hecoCon, setHecoCon] = useState('');
  const [hecoAmount, setHecoAmount] = useState('0');
  const [bscCon, setBscCon] = useState('');
  const [bscAmount, setBscAmount] = useState('0');
  const [ethAmount, setEthAmount] = useState('0');

  const [ethCon, setEthCon] = useState('');
  const [topAddr, setTopAddr] = useState('');

  useEffect(() => {
    config('swapAddress').then((res: any) => {
      setHecoCon(res.result.HECO);
      setBscCon(res.result.BSC);
    });
    bscTotalInboundAssets().then((res: any) => {
      setBscAmount(res.result);
    });
    hecoTotalInboundAssets().then((res: any) => {
      setHecoAmount(res.result);
    });
    receiveAddress('ETH').then(d => {
      setEthCon(d);
    });
    token('ETH').then(d => {
      setTopAddr(d);
    });
  }, []);

  useEffect(() => {
    if (ethCon && topAddr) {
      receiveAddressErc20('ETH').then(d => {
        setEthAmount(accuracy(d.result, 18, 8));
      });
    }
  }, [ethCon, topAddr]);

  const getStatus = ({ transferStatus }) => {
    let statu = '';
    if (transferStatus === 'INIT') {
      statu = 'Completed';
    } else if (transferStatus === 'TRANSFER') {
      statu = 'Confirming';
    } else if (transferStatus === 'SUCCESS') {
      statu = 'Completed';
    } else if (transferStatus === 'FAIL' || transferStatus === 'TRANSFERFAIL') {
      statu = 'Fail';
    }
    return statu;
  };

  function onChange(v) {
    setCurrent(v);
  }

  // useEffect(() => {
  //   getList();
  //   const inter = setInterval(() => getList(), 30 * 1000);
  //   return () => {
  //     if (inter) {
  //       clearInterval(inter);
  //     }
  //   };
  // }, [account]);
  return {
    current,
    total,
    record,
    goBack,
    getStatus,
    onChange,
    hecoCon,
    bscCon,
    ethCon,
    hecoAmount,
    bscAmount,
    ethAmount,
    realCurrent,
  };
};

export default useRecord;
