import TopJs from 'top-sdk-js-v2';

/** transfer */
// let tx = await topjs.generateTx({
//     txMethod: 'transfer',
//     from: pAccount.address,
//     nonce,
//     latest_tx_hash_xxhash64,
//     to: 'T80000d50f507f4d81e5bff6759815dc3892d8a2909098',
//     amount: 10,
//     note: 'transfer test'
// });
let _topjs;
export const getTopJs = () => {
  if (!_topjs) {
    _topjs = new TopJs(window.topProvider.rpcUrl, {
      pollCount: 5,
      pollDelayTime: 3000,
    });
  }
  return _topjs;
};

export function transAddress(address) {
  if (address.startsWith('T8')) {
    return 'T' + address.slice(1).toLowerCase();
  }
  return address;
}

async function getAccountInfo() {
  const topjs = getTopJs();
  const address = transAddress(window.topProvider.selectedAddress);
  const accountInfo = await topjs.getAccount({
    address,
  });
  const nonce = accountInfo.data.nonce;
  const latest_tx_hash_xxhash64 = accountInfo.data.latest_tx_hash_xxhash64;
  return {
    from: address,
    nonce,
    latest_tx_hash_xxhash64,
  };
}

export async function getTopTokenInfo() {
  const topjs = getTopJs();
  const address = transAddress(window.topProvider.selectedAddress);
  const accountInfo = await topjs.getAccount({
    address,
  });
  const balance = accountInfo.data.balance;
  return {
    balance,
    decimals: 6,
  };
}

export const topTransfer = async (amount, to) => {
  let txHash = '';
  try {
    const topjs = getTopJs();
    const accountInfo = await getAccountInfo();
    const tx = await topjs.generateTx({
      txMethod: 'transfer',
      from: accountInfo.from,
      nonce: accountInfo.nonce,
      latest_tx_hash_xxhash64: accountInfo.latest_tx_hash_xxhash64,
      amount: Number(amount),
      to,
      note: 'transfer',
    });
    txHash = JSON.parse(tx.body).params.tx_hash;
    console.log('[transfer signedTx before]', JSON.stringify(tx), tx);

    const signedTx = await (window as any).signTransaction(tx);
    // const signedTx = await topjs.signTransaction(
    //   tx,
    //   window.topProvider.privateKey
    // );
    console.log('[transfer signedTx]', JSON.stringify(signedTx), signedTx);
   
    const result = await topjs.sendSignedTransaction(signedTx);
    if (result.errno) {
      console.log(result);
      throw new Error(result.errno);
    }
    result.from = accountInfo.from;
    result.txHash = txHash;
    return result;
  } catch (error) {
    console.log('[transter error]', error, to, amount);
    throw error;
  }
};

const TX_TIMES = 105;
export function waitTxSuccess(txHash) {
  return new Promise((resolve, reject) => {
    const topjs = getTopJs();
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
