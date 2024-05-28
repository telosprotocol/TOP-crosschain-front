import React, {
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { Toast, Layout } from '@/components';
import './index.less';
import { saveHash } from '@/api';
import BigNumber from 'bignumber.js';
import { MobXProviderContext } from 'mobx-react';
import { observer } from 'mobx-react';
import Web3 from 'web3';
import TopJs from 'top-sdk-js-v2';
import { trackPV } from '@/api/track';

// const dataToAddress = isDev
//   ? '0xEc485DDfe2Dd2F5D2C96EaEC18C04F9C8b54936a'
//   : '0xdcd85914b8ae28c1e62f1c488e1d968d5aaffe2b';
const dataToAddressETH = '0xdcd85914b8ae28c1e62f1c488e1d968d5aaffe2b';

const dataToAddressHB = '0x16De6497292ca52D10038c641BD1d518113a51Dc';

const web3 = {};

const rpc = {
  ETH: 'https://api.mycryptoapi.com/eth',
  BSC: 'https://bsc-dataseed.binance.org',
  HECO: 'https://http-mainnet-node.huobichain.com',
};

function getWeb3(chain) {
  if (web3[chain]) {
    return web3[chain];
  }
  if (chain === 'TOP') {
    const _topjs = new TopJs('http://grpc.topscan.io:19081', {
      pollCount: 5,
      pollDelayTime: 3000,
    });
    web3[chain] = _topjs;
    return _topjs;
  } else {
    const tmpWeb3 = new Web3(rpc[chain]);
    web3[chain] = tmpWeb3;
    return tmpWeb3;
  }
}

const TX_TIMES = 105;
function waitTxSuccess(txHash, topjs) {
  return new Promise((resolve, reject) => {
    let times = TX_TIMES;
    const intervalId = setInterval(() => {
      times--;
      if (times < 0) {
        clearInterval(intervalId);
        reject('timeout');
        return;
      }
      topjs
        .getTransaction({
          txHash,
        })
        .then(r => {
          console.log('tx hash > ', JSON.stringify(r));
          if (r.errno !== 0) {
            return;
          }
          const tx_state = r.data.tx_state;
          if (tx_state !== 'success' && tx_state !== 'failure') {
            return;
          }
          clearInterval(intervalId);
          if (r.data.tx_state === 'success') {
            return resolve(r.data);
          }
          reject(tx_state);
        });
    }, 3000);
  });
}

const Report: React.FunctionComponent = () => {
  const {
    chain: { netShortName },
  } = useContext(MobXProviderContext);

  const [hash, setHash] = useState(
    '0xda860fed24b3defa411aff9f7cd2276b69c67fd99628d11a3e63654a5ea58e9b'
  );
  const [amount, setAmount] = useState('');
  const [receiveAddress, setReceiveAddress] = useState('');
  const [account, setAccount] = useState('');
  const [sourceChain, setSourceChain] = useState('ETH');
  const [toChain, setToChain] = useState('BSC');

  const [hashLoading, setHashLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (netShortName) {
      setSourceChain(netShortName);
      if (netShortName === 'BSC') {
        setToChain('HECO');
      }
    }
  }, [netShortName]);

  async function parseHash() {
    try {
      setHashLoading(true);
      const web3 = getWeb3(sourceChain);
      if (sourceChain === 'TOP') {
        const res: any = await waitTxSuccess(hash, web3);
        setAccount(res.original_tx_info.sender_account);
        const stakeAmount = new BigNumber(res.original_tx_info.amount).div(
          new BigNumber(10).pow(6)
        );
        setAmount(stakeAmount.toString());
      } else {
        const data = await web3.eth.getTransaction(hash);
        console.log('data', data);
        if (sourceChain === 'ETH') {
          if (data.to.toLowerCase() !== dataToAddressETH.toLowerCase()) {
            setHashLoading(false);
            return;
          }
        } else {
          if (data.to.toLowerCase() !== dataToAddressHB.toLowerCase()) {
            setHashLoading(false);
            return;
          }
        }
        setReceiveAddress(data.from);
        setAccount(data.from);
        const stakeAmount = new BigNumber(data.input.slice(-64), 16).div(
          new BigNumber(10).pow(18)
        );
        setAmount(stakeAmount.toString());
      }
    } catch (error) {
    }
    setHashLoading(false);
  }

  async function handleClick() {
    if (!account) {
      Toast.fail('Source address is empty.');
      return;
    }
    if (!receiveAddress) {
      Toast.fail('Receive address is empty.');
      return;
    }
    if (!hash) {
      Toast.fail('Hash is empty.');
      return;
    }
    if (!amount) {
      Toast.fail('Amount is empty.');
      return;
    }
    if (sourceChain === toChain) {
      Toast.fail('Source Chain cannot be equal to Receive Chain.');
      return;
    }
    if (toChain === 'TOP' && sourceChain === 'ETH') {
      return;
    }
    if (
      sourceChain !== 'TOP' &&
      toChain !== 'TOP' &&
      receiveAddress !== account
    ) {
      return;
    }
    setLoading(true);
    try {
      await saveHash({
        sourceChain,
        address: account,
        toChain,
        reviceAddress: receiveAddress,
        sourceHash: hash,
        amount,
      });
      Toast.success('Success');
    } catch (error) {
      Toast.fail((error as any).message);
    }
    setLoading(false);
  }

  useEffect(() => {
    trackPV();
  }, []);

  return (
    <Layout>
      <div className="re_contaniner">
        <div>
          <div>Source chain: </div>
          <div>
            <select
              value={sourceChain}
              onChange={e => setSourceChain(e.target.value)}
            >
              <option>ETH</option>
              <option>BSC</option>
              <option>HECO</option>
              <option>TOP</option>
            </select>
          </div>
        </div>
        <div>
          <div>Hash:</div>
          <input
            placeholder="please input hash"
            value={hash}
            onChange={e => setHash(e.target.value)}
          />
          <button
            style={{ marginLeft: '12px' }}
            onClick={parseHash}
            disabled={hashLoading}
          >
            Parse hash
          </button>
        </div>

        <div>
          <div>Source address:</div>
          <input
            placeholder="please input source address"
            value={account}
            disabled={true}
            onChange={e => setAccount(e.target.value)}
          />
        </div>
        <div>
          <div>Receive chain: </div>
          <div>
            <select value={toChain} onChange={e => setToChain(e.target.value)}>
              <option>BSC</option>
              <option>HECO</option>
              <option>TOP</option>
            </select>
          </div>
        </div>
        <div>
          <div>Receive address:</div>
          <input
            placeholder="please input receive address"
            disabled={sourceChain !== 'TOP' && toChain !== 'TOP'}
            value={receiveAddress}
            onChange={e => setReceiveAddress(e.target.value)}
          />
        </div>

        <div>
          <div>Amount:</div>
          <input
            placeholder="please input amount"
            value={amount}
            disabled={true}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div>
          <div />
          <button className="save_btn" onClick={handleClick} disabled={loading}>
            save{' '}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default observer(Report);
