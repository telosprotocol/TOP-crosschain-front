import { track } from './track';
import { secretApi } from './util';

export function saveHash(body) {
  // source
  //pc:stakingPC
  return secretApi.post('/v1/exchange/saveHash', {
    body: { ...body },
  });
}

export function saveHash2(body) {
  // source
  //pc:stakingPC
  return secretApi.post('/v1/aggragation/bridge/reportFromTxHash', {
    body: { ...body },
  });
}

export function getTransactionReceipt(txHash) {
  return secretApi.post('/v1/aggragation/bridge/getTransactionReceipt', {
    body: { txHash },
  });
}

export function token(chain) {
  return secretApi
    .get<string>(`/v1/exchange/topErc20Address/${chain}`, {
      params: { chain },
    })
    .then(r => r.result);
}

export function receiveAddress(chain) {
  return secretApi
    .get<string>(`/v1/exchange/receive/${chain}`, {
      params: { chain },
    })
    .then(r => r.result);
}

export function crossChainFee(chain) {
  return secretApi.get(`/v1/exchange/gasTop/${chain}`, {
    params: { chain },
  });
}

export function verifyTicketTransfer(params: { hash: string }) {
  (params as any).t = new Date().getTime();
  return secretApi.get('/v1/exchange/verify_top_transfer', { params });
}

export function getRecord(body) {
  return secretApi.post<any>('/v1/exchange/page/exchange', { body });
}

export function allTransfer(body) {
  return secretApi.post<any>('/v1/exchange/page/tranfer', { body });
}

export function sumTotalAmount(chain) {
  return secretApi.get<any>(`/v1/exchange/sumTotalAmount/${chain}`, {
    params: {
      chain,
      t: Date.now(),
    },
  });
}

// bscTotalInboundAssets
export function bscTotalInboundAssets() {
  return secretApi.get<any>(`/v1/exchange/bscTotalInboundAssets`, {
    params: {
      t: Date.now(),
    },
  });
}

// hecoTotalInboundAssets
export function hecoTotalInboundAssets() {
  return secretApi.get<any>(`/v1/exchange/hecoTotalInboundAssets`, {
    params: {
      t: Date.now(),
    },
  });
}

// config
export function config(code) {
  return secretApi.get(`/v1/config/${code}`, {
    params: {
      code,
    },
  });
}

export function getConf(body = {}) {
  return secretApi.post('/common/get_contract_config', { body });
}

export function getBindInfo(params: { ethAddress: string; t: number }) {
  // return secretApi.get('/swap/query_bind_info', { params });
}

export function receiveAddressErc20(type) {
  return secretApi.get(`/v1/exchange/receiveAddressErc20/${type}`, {
    params: {
      t: Date.now(),
    },
  });
}

export function bindAddress(body: {
  ethAddress: string;
  message: string;
  signature: string;
}) {
  track({
    event: 'bind',
    body: JSON.stringify(body),
  });
  return secretApi.post('/swap/bind', { body });
}

// /**
//  * transfer Top coin From Eth To Bsc
//  * @returns
//  */
// export function transferTopFromEthToBsc(params: {
//   signedTransferStr: string,
//   address: string,
//   money: number
// }) {
//   return secretApi.post('/swap/bind', { params });
//   // return Promise.resolve({
//   //   result: true,
//   //   code: 200,
//   //   message: ""
//   // })
// }

// /**
//  * transfer Top coin From Eth To Heco
//  * @returns
//  */
// export function transferTopFromEthToHeco(params: {
//   signedTransferStr: string,
//   address: string,
//   money: number
// }) {
//   return secretApi.post('/swap/bind', { params });
//   // return new Promise<R & OtherResponse<T>>({
//   //   result: true,
//   //   code: 200,
//   //   message: ""
//   // })
// }

// /v1/aggragation/bridge/unCompletedTxlist
export function unCompletedTxlist(body: {
  fromAddress: string;
  fromChainType: string;
  receiverAddress: string;
  toChainType: string;
}) {
  return secretApi.post('/v1/aggragation/bridge/unCompletedTxlist', { body });
}
