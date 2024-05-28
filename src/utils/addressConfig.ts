
import {
  ETH_BRIDGE,
  ETH_ERC20_LOCKER,
  ETH_ERC20_USDC,
  ETH_ERC20_USDT,
  ETH_ETH_LOCKER,
  TOP_ERC20_ETH,
  TOP_ERC20_LOCKER,
  TOP_ERC20_USDC,
  TOP_ERC20_USDT,
  TOP_ETH_LOCKER,
} from '@/config';

const ethCoinMap = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDT: ETH_ERC20_USDT,
  USDC: ETH_ERC20_USDC,
};

export function getETHCoinAddress(coinType) {
  return ethCoinMap[coinType] || 'sf';
}

export function getEthCoinKey() {
  return Object.keys(ethCoinMap);
}

export const topCoinMap = {
  ETH: TOP_ERC20_ETH,
  USDT: TOP_ERC20_USDT,
  USDC: TOP_ERC20_USDC,
};

export function getTOPCoinAddress(coinType) {
  return topCoinMap[coinType] || 'sf';
}

export function getTopCoinKey() {
  return Object.keys(topCoinMap);
}

export function getETHLockContractAddr(coinAddress) {
  if (
    coinAddress === 'ETH' ||
    coinAddress === '0x0' ||
    coinAddress.toLowerCase() === ethCoinMap['ETH'].toLowerCase()
  ) {
    return ETH_ETH_LOCKER;
  } else {
    return ETH_ERC20_LOCKER;
  }
}

export function getTOPUnlockContractAddr(coinAddress) {
  if (
    coinAddress === 'ETH' ||
    coinAddress === '0x0' ||
    coinAddress.toLowerCase() === topCoinMap['ETH'].toLowerCase()
  ) {
    return TOP_ETH_LOCKER;
  } else {
    return TOP_ERC20_LOCKER;
  }
}

export function getETHBridgeAddr(coinAddress) {
  if (
    coinAddress === 'ETH' ||
    coinAddress === '0x0' ||
    coinAddress.toLowerCase() === ethCoinMap['ETH'].toLowerCase()
  ) {
    return ETH_BRIDGE;
  } else {
    return ETH_BRIDGE;
  }
}
