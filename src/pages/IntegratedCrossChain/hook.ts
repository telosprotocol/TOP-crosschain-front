import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { MobXProviderContext } from 'mobx-react';
import { fixZero, splitNumber, scala, toBN, accuracy, sleep } from '@/utils';
import {
  getETHCoinAddress,
  getEthCoinKey,
  getETHLockContractAddr,
  getTOPCoinAddress,
  getTopCoinKey,
  getTOPUnlockContractAddr,
} from '@/utils/addressConfig';
import {
  approveEth,
  approveTop,
  ethEthPoolBalance,
  ethPoolBalance,
  getEthAllowance,
  getEthBalance,
  getEthLimit,
  getTokenInfo,
  getTopAllowance,
  getTopLimit,
  lockEthToken,
  lockTOPToken,
  walletConnectGetEthBalance,
  walletConnectGetTokenInfo,
} from '@/eth/method';
import { useHistory } from 'react-router-dom';
import { Toast } from '@/components';
import { topToEthUnlockToken, unlockToken } from '@/eth/unlock';
import ReactTooltip from 'react-tooltip';
import { getEthQueryWeb3, getTopQueryWeb3 } from '@/eth/queryWeb3';
import { addEthNetwork, addTopNetwork } from '@/store/chainStore';
import { track } from '@/api/track';

function getStorageEthToTop() {
  const isEthToTop = localStorage.getItem('_isEthToTop') || '1';
  return isEthToTop === '1';
}

const useExHook = () => {
  const {
    locale: { getLocaleMessage, lan },
    chain,
    walletConnect,
  } = useContext(MobXProviderContext);
  const {
    address,
    account,
    topAddr,
    netShortName,
    isUseConnectWallet,
    isEthNetwork,
    currentTx,
    changeMetamaskDialog,
  } = chain;
  const history = useHistory();
  const goRecord = () => history.push('/record');
  const [amount, setAmount] = useState('');

  const [allAmount, setAllAmount] = useState('0');
  const [allAmountStr, setAllAmountStr] = useState('Balance: -'); // Balance: -; Balance: <br>111111;

  const [coinTypesVisible, setCoinTypesVisible] = useState(false);

  const [coinType, setCoinType] = useState(getEthCoinKey()[0]);
  const [selectCoinTypeList] = useState(getEthCoinKey());

  const [poolAmount, setPoolAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceAll, setBalanceAll] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const [ethToTop, setEthToTop] = useState(getStorageEthToTop());

  const [updateBalance, setUpdateBalance] = useState(0);

  const [successEXTRACTABLE, setSuccessEXTRACTABLE] = useState({});

  const [showFaqDialog, setShowFaqDialog] = useState(false);


  const [maxMinValue, setMaxMinValue] = useState([0, 0]);

  const [changeTopChainAddress, setChangeTopChainAddress] = useState(false);

  useEffect(() => {
    localStorage.setItem('_isEthToTop', ethToTop ? '1' : '0');
    ReactTooltip.rebuild();
  }, [ethToTop]);

  useEffect(() => {
    setBalanceAll(0);
    setBalance(0);
    setDecimals(18);
    if (!ethToTop) {
      if (netShortName && coinType && account) {
        const coinAddress = getTOPCoinAddress(coinType);

        if (coinType === 'ETH') {
          getEthBalance(
            account,
            isEthNetwork ? getTopQueryWeb3() : undefined
          ).then(({ balance, decimals }) => {
            setBalanceAll(accuracy(balance, decimals, decimals, true));
            setBalance(accuracy(balance, decimals, 6));
            setDecimals(decimals);
          });
        } else {
          getTokenInfo(
            account,
            coinAddress,
            isEthNetwork ? getTopQueryWeb3() : undefined
          ).then(({ balance, decimals }) => {
            setBalanceAll(accuracy(balance, decimals, decimals, true));
            setBalance(accuracy(balance, decimals, 6));
            setDecimals(decimals);
          });
        }
        getTopLimit(coinAddress).then(v => {
          setMaxMinValue(v);
        });
      }
    } else {
      if (walletConnect.netShortName && coinType && walletConnect.account) {
        const coinAddress = getETHCoinAddress(coinType);
        if (coinAddress !== '0x0000000000000000000000000000000000000000') {
          ethPoolBalance(
            getETHLockContractAddr(coinAddress),
            coinAddress,
            !isEthNetwork ? getEthQueryWeb3() : undefined
          ).then(({ accBalance }) => {
            setPoolAmount(accBalance);
          });
          walletConnectGetTokenInfo(
            walletConnect.account,
            coinAddress,
            !isEthNetwork ? getEthQueryWeb3() : undefined
          ).then(({ balance, decimals }) => {
            setBalanceAll(accuracy(balance, decimals, decimals, true));
            setBalance(accuracy(balance, decimals, 6));
            setDecimals(decimals);
          });
        } else {
          ethEthPoolBalance(
            getETHLockContractAddr(coinAddress),
            !isEthNetwork ? getEthQueryWeb3() : undefined
          ).then(({ accBalance }) => {
            setPoolAmount(accBalance);
          });
          walletConnectGetEthBalance(
            walletConnect.account,
            !isEthNetwork ? getEthQueryWeb3() : undefined
          ).then(({ balance, decimals }) => {
            setBalanceAll(accuracy(balance, decimals, decimals, true));
            setBalance(accuracy(balance, decimals, 6));
            setDecimals(decimals);
          });
        }
        getEthLimit(coinAddress).then(v => {
          setMaxMinValue(v);
        });
      }
    }
  }, [
    netShortName,
    coinType,
    account,
    updateBalance,
    ethToTop,
    walletConnect.account,
  ]);

  const [userInputReceiveAddress, setUserInputReceiveAddress] = useState('');

  useEffect(() => {
    if (netShortName && coinType) {
      if (!(netShortName === 'TOP' || coinType === 'TOP')) {
        setUserInputReceiveAddress(account);
      } else {
        setUserInputReceiveAddress('');
      }
    }
  }, [netShortName, coinType, account]);

  const [tx, setTx] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rebindTipVisible, setRebindTipVisible] = useState(false);

  const [loadingExtra, setLoadingExtra] = useState(false);
  const [showExtractable, setShowExtractable] = useState(false);
  const [extractableObject, setExtractableObject] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = splitNumber(e.target.value, 6);
    if (Number(amount) < 0) {
      setAmount('0');
      return;
    }
    setAmount(amount);
  };

  const handleKeypress = (e: any) => {
    if (e.charCode === 45) {
      e.preventDefault();
    }
  };

  const handleAllIn = useCallback(() => setAmount(fixZero(balance)), [balance]);
  const ButtonDisable = useMemo(() => {
    if (loading) {
      return true;
    }
    if (Number(amount) <= 0) {
      return true;
    }
    return false;
  }, [amount, balance, balanceAll, loading]);

  const handleConfirm = useCallback(() => {
    if (currentTx.from) {
      Toast.prompt(
        'There is a transaction that has not been completed, please check it now!',
        5000,
        '',
        ''
      );
      return;
    }
    if (!isUseConnectWallet) {
      if (ethToTop && !isEthNetwork) {
        // switch to eth network
        addEthNetwork();
        return;
      }
      if (!ethToTop && isEthNetwork) {
        // switch to top network
        addTopNetwork();
        return;
      }
    }
    if (loading) {
      Toast.fail(getLocaleMessage('toast.hasTX'));
      return;
    }
    const number = Number(amount);


    if (toBN(amount).isGreaterThan(toBN(balance))) {
      Toast.fail(getLocaleMessage('toast.insufficient'));
      return;
    }
    if (!ethToTop) {
      if (
        toBN(amount).isGreaterThan(toBN(accuracy(maxMinValue[0], decimals, 18)))
      ) {
        Toast.fail(
          `Maximum transaction amount ${accuracy(
            maxMinValue[0],
            decimals,
            18
          )} ${coinType}.`
        );
        return;
      }
      if (
        toBN(amount).isLessThanOrEqualTo(toBN(accuracy(maxMinValue[1], decimals, 18)))
      ) {
        Toast.fail(
          `Minimum transaction amount: over ${accuracy(
            maxMinValue[1],
            decimals,
            18
          )} ${coinType}.`
        );
        return;
      }
    }

    if (number > 0) {
      setTx('');
      setVisible(true);
    }
  }, [
    amount,
    balance,
    balanceAll,
    loading,
    userInputReceiveAddress,
    netShortName,
    coinType,
    maxMinValue,
    decimals,
  ]);

  const handleClose = () => {
    setVisible(false);
  };

  const handleEX = useCallback(async () => {
    if (tx) {
      handleClose();
      return;
    }
    if (loading) {
      return;
    }
    const number = Number(amount);
    if (number <= 0) {
      return;
    }

    setLoading(true);
    try {
      const scalaAmount = scala(amount, decimals);
      const coinAddress = getETHCoinAddress(coinType);
      if (coinType !== 'ETH') {
        const allowance = await getEthAllowance(
          walletConnect.account,
          getETHLockContractAddr(coinType),
          coinAddress
        );
        if (!toBN(allowance).isGreaterThanOrEqualTo(scalaAmount)) {
          await approveEth(
            getETHLockContractAddr(coinType),
            scalaAmount,
            walletConnect.account,
            tx => {
              console.log('tx', tx);
              track({
                event: 'authorize',
                tx_hash: tx,
                value: amount,
                from: localStorage.getItem('_account') || '',
                to: getETHLockContractAddr(coinType),
                data: JSON.stringify({
                  coinType,
                }),
              });
            },
            coinAddress
          );
          await sleep(3000);
        }
      }
      const res: any = await lockEthToken(
        coinAddress,
        scalaAmount,
        account,
        walletConnect.account,
        hash => {
          setLoading(false);
          setVisible(false);
          setAmount('');
          setUpdateBalance(c => c + 1);
          chain.changeCurrentTx({
            from: ethToTop ? 'ETH' : 'TOP',
            to: !ethToTop ? 'ETH' : 'TOP',
            coinType,
            amount,
            type: ethToTop
              ? 'Lock to pool transaction'
              : 'Burn token transaction',
          });
          track({
            event: 'lock',
            tx_hash: hash,
            value: amount,
            from: localStorage.getItem('_account') || '',
            to: getETHLockContractAddr(coinAddress),
            data: JSON.stringify({
              coinAddress,
              amount: scalaAmount,
              receiverAddress: account,
              coinType,
            }),
          });
        }
      );
      Toast.success(
        getLocaleMessage('toast.success', { amount }),
        10000,
        res.transactionHash,
        netShortName
      );
      chain.changeCurrentTx({});
      setUpdateBalance(c => c + 1);
    } catch (error) {
      setLoading(false);
    }
  }, [amount, loading, tx, visible]);

  const handleTopToEthEX = useCallback(async () => {
    if (tx) {
      handleClose();
      return;
    }
    if (loading) {
      return;
    }
    const number = Number(amount);
    if (number <= 0) {
      return;
    }

    setLoading(true);
    try {
      const scalaAmount = scala(amount, decimals);
      const coinAddress = getTOPCoinAddress(coinType);
      if (coinType !== 'ETH') {
        const allowance = await getTopAllowance(
          account,
          getTOPUnlockContractAddr(coinType),
          coinAddress
        );
        if (!toBN(allowance).isGreaterThanOrEqualTo(scalaAmount)) {
          await approveTop(
            getTOPUnlockContractAddr(coinType),
            scalaAmount,
            account,
            tx => {
              console.log('tx', tx);
              track({
                event: 'authorize',
                tx_hash: tx,
                value: amount,
                from: localStorage.getItem('_account') || '',
                to: getTOPUnlockContractAddr(coinType),
                data: JSON.stringify({
                  coinType,
                }),
              });
            },
            coinAddress
          );
          await sleep(3000);
        }
      }
      const res: any = await lockTOPToken(
        coinAddress,
        scalaAmount,
        walletConnect.account,
        account,
        hash => {
          setLoading(false);
          setVisible(false);
          setAmount('');
          setUpdateBalance(c => c + 1);
          chain.changeCurrentTx({
            from: ethToTop ? 'ETH' : 'TOP',
            to: !ethToTop ? 'ETH' : 'TOP',
            coinType,
            amount,
            type: ethToTop
              ? 'Lock to pool transaction'
              : 'Burn token transaction',
          });
          track({
            event: 'burn',
            tx_hash: hash,
            value: amount,
            from: localStorage.getItem('_account') || '',
            to: getETHLockContractAddr(coinAddress),
            data: JSON.stringify({
              coinAddress,
              amount: scalaAmount,
              receiverAddress: walletConnect.account,
              coinType,
            }),
          });
        }
      );

      Toast.success(
        getLocaleMessage('toast.success', { amount }),
        10000,
        res.transactionHash,
        netShortName
      );
      setUpdateBalance(c => c + 1);
      chain.changeCurrentTx({});
    } catch (error) {
      Toast.fail('Error');
      setLoading(false);
    }
  }, [amount, loading, tx, visible, coinType, ethToTop]);

  const handleOpenCoinTypes = useCallback(() => {
    setCoinTypesVisible(c => !c);
  }, []);
  const handleCloseCoinTypes = useCallback(() => {
    setCoinTypesVisible(false);
  }, []);
  const handleChangeCoinTypes = useCallback(cType => {
    setCoinType(cType);
    setCoinTypesVisible(false);
  }, []);

  async function handleUnLockClick(hash, hashCoinType) {
    if (currentTx.from) {
      Toast.prompt(
        'There is a transaction that has not been completed, please check it now!',
        5000,
        '',
        ''
      );
      return;
    }
    if (isEthNetwork) {
      // switch to top
      addTopNetwork();
      return;
    }
    setLoadingExtra(true);
    try {
      // const res = await topToEthUnlockToken(hash, walletConnect.account);
      const res = await unlockToken(
        hash,
        walletConnect.account,
        hashCoinType,
        cHash => {
          setLoadingExtra(false);
          setShowExtractable(false);
          chain.changeCurrentTx({
            from: ethToTop ? 'ETH' : 'TOP',
            to: !ethToTop ? 'ETH' : 'TOP',
            coinType: extractableObject.tokenSymbol,
            amount: extractableObject.amount,
            type: ethToTop
              ? 'Claim to mint transaction'
              : 'Claim from pool transaction',
          });
          track({
            event: 'mint',
            tx_hash: cHash,
            value: extractableObject.amount,
            from: localStorage.getItem('_account') || '',
            to: getETHLockContractAddr(hashCoinType),
            data: JSON.stringify({
              hash,
              coinType: hashCoinType,
            }),
          });
        }
      );
      Toast.success(
        getLocaleMessage('toast.success', { amount: extractableObject.amount }),
        5000,
        '',
        ''
      );
      setSuccessEXTRACTABLE(v => {
        return {
          ...v,
          [hash]: true,
        };
      });
      chain.changeCurrentTx({});
    } catch (error) {
      console.error(error);
      setLoadingExtra(false);
      Toast.fail(
        (error as any).message === 'Has claimed' ? 'Has claimed' : 'Error'
      );
    }
  }

  async function handleEthUnLockClick(hash, hashCoinType) {
    if (currentTx.from) {
      Toast.prompt(
        'There is a transaction that has not been completed, please check it now!',
        5000,
        '',
        ''
      );
      return;
    }
    if (!isEthNetwork) {
      // switch to top
      addEthNetwork();
      return;
    }
    setLoadingExtra(true);
    try {
      const res = await topToEthUnlockToken(
        hash,
        walletConnect.account,
        hashCoinType,
        cHash => {
          setLoadingExtra(false);
          setShowExtractable(false);
          chain.changeCurrentTx({
            from: ethToTop ? 'ETH' : 'TOP',
            to: !ethToTop ? 'ETH' : 'TOP',
            coinType: extractableObject.tokenSymbol,
            amount: extractableObject.amount,
            type: ethToTop
              ? 'Claim to mint transaction'
              : 'Claim from pool transaction',
          });
          track({
            event: 'unlock',
            tx_hash: cHash,
            value: extractableObject.amount,
            from: localStorage.getItem('_account') || '',
            to: getETHLockContractAddr(hashCoinType),
            data: JSON.stringify({
              hash,
              coinType: hashCoinType,
            }),
          });
        }
      );

      Toast.success(
        getLocaleMessage('toast.success', { amount: extractableObject.amount }),
        5000,
        '',
        ''
      );
      setSuccessEXTRACTABLE(v => {
        return {
          ...v,
          [hash]: true,
        };
      });
      chain.changeCurrentTx({});
    } catch (error) {
      console.error(error);
      setLoadingExtra(false);
      let message = 'Error';
      if ((error as any).message === 'Has claimed') {
        message = 'Has claimed';
      }
      if (
        (error as any).message ===
        'Sorry, your claim has been blocked on blockchain. Please contact the TOP support team for more information.'
      ) {
        message =
          'Sorry, your claim has been blocked on blockchain. Please contact the TOP support team for more information.';
      }
      Toast.fail(message);
    }
  }

  return {
    getLocaleMessage,
    amount,
    allAmount,
    allAmountStr,
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
    goRecord,
    visible,
    ButtonDisable,
    topAddr,
    lan,
    rebindTipVisible,
    setRebindTipVisible,
    coinType,
    coinTypesVisible,
    handleOpenCoinTypes,
    handleCloseCoinTypes,
    handleChangeCoinTypes,
    netShortName,
    selectCoinTypeList,
    userInputReceiveAddress,
    setUserInputReceiveAddress,
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
  };
};

export default useExHook;
