import { topRpc } from './queryWeb3';

export function top_getRelayTransactionReceipt(hash: string): Promise<any> {
  return post({
    method: 'topRelay_getTransactionReceipt',
    params: [hash],
  });
}
// export function top_getRelayBlockByNumber(blockNumber: number): Promise<any> {
//   return post({
//     method: 'top_getRelayBlockByNumber',
//     params: [blockNumber],
//   });
// }

export function top_getRelayBlockByHash(blockHash: string): Promise<any> {
  return post({
    method: 'topRelay_getBlockByHash',
    params: [blockHash, false],
  });
}

export async function topRelay_getPolyBlockHashListByHash(
  blockHash: string
): Promise<any> {
  const res = await post({
    method: 'topRelay_getBlockByHash',
    params: [blockHash, false, 'aggregate'],
  });
  return res.aggregateList;
}

export async function topRelay_getLeafBlockHashListByHash(
  polyBlockHash: string
): Promise<any> {
  const res = await post({
    method: 'topRelay_getBlockByHash',
    params: [polyBlockHash, false, 'transaction'],
  });
  return res.blockList;
}

async function post(data: any) {
  const response = await fetch(topRpc, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      ...data,
      id: 1,
    }),
  });
  const res = await response.json();
  return res.result;
}

// REGISTER_ETH_QUERY_METHOD(topRelay_getPolyBlockHashListByHash);

// REGISTER_ETH_QUERY_METHOD(topRelay_getLeafBlockHashListByHash);

// REGISTER_ETH_QUERY_METHOD(topRelay_getBlockByNumber);

// REGISTER_ETH_QUERY_METHOD(topRelay_getBlockByHash);

// REGISTER_ETH_QUERY_METHOD(topRelay_blockNumber);

// REGISTER_ETH_QUERY_METHOD(topRelay_getTransactionByHash);

// REGISTER_ETH_QUERY_METHOD(topRelay_getTransactionReceipt);
