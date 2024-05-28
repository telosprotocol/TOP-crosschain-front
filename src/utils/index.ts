import { getWeb3, isDev } from '@/eth';
import BigNumber from 'bignumber.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y' },
  { l: 'yy', d: 'year' },
];
const config = {
  thresholds,
};

export const getRandom = (length: string | number): number => {
  const num = Math.random() * Number(length);
  return parseInt(String(num), 10);
};

export const formatTime1 = data => {
  if (!data) {
    return '';
  }
  return data.replace(
    /^(\d\d\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/,
    '$1-$2-$3 $4:$5:$6'
  );
};

export const formatAddress = (address?: string) => {
  if (!address) {
    return '';
  }
  if (address.length < 10) {
    return address;
  }
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export const splitNumber = (num, decimals = 18) => {
  const _num = String(num);
  if (!num) {
    return '';
  }
  let result = _num;
  if (num.includes('.')) {
    const temp = _num.split('.');
    result = temp[0] + '.' + temp[1].slice(0, decimals);
  }
  return result;
};

export const accuracy = (num, decimals, fix, acc = false): any => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  const n = new BigNumber(num)
    .div(new BigNumber(10).pow(Number(decimals)))
    .toFixed(Number(fix), BigNumber.ROUND_DOWN);
  if (acc) {
    return n;
  }
  return Number(n);
};

export const scala = (num, decimals) => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  return new BigNumber(num)
    .times(new BigNumber(10).pow(Number(decimals)))
    .toFixed(0);
};

export const fixZero = (str: string | number) => {
  return String(str).replace(/(?:\.0*|(\.\d+?)0+)$/, '$1');
};

export const toBN = (num: string | number) => {
  return new BigNumber(num);
};

export const formatBalance = (num: any, length = 6) => {
  if (!num || Number(num) === 0) {
    return 0;
  }

  num = num.toString();
  let c;
  if (num.toString().indexOf('.') !== -1) {
    const temp = num.split('.');
    c =
      temp[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') +
      '.' +
      temp[1].slice(0, length);
  } else {
    c = num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  return c;
};

export const fixedZero = (num, decimals = 6) => {
  if (Number(num) === 0 || !num) {
    return 0;
  }
  return new BigNumber(num).toFixed(Number(decimals), BigNumber.ROUND_DOWN);
};

export const checkTOPAddr = topAddr =>
  /^T00000[a-zA-Z0-9]{34}$/.test(topAddr) ||
  /^T80000[a-fA-F0-9]{40}$/.test(topAddr);

export const checkTOPAddrLowerCase = topAddr => {
  if (topAddr.startsWith('T0')) {
    return true;
  }
  topAddr = topAddr.replace(/^T/, '');
  return topAddr === topAddr.toLowerCase();
};

export const checkEthAddress = addr => {
  if (!addr) {
    return false;
  }
  // const web3 = getWeb3();
  // return web3.utils.isAddress(addr);
  return /^(0x){1}[0-9a-fA-F]{40}$/i.test(addr);
};

export const openBrowser = (addr, chain) => {
  if (isDev) {
    if (chain === 'TOP') {
      window.open(
        `https://bouwww.topscan.io/en-US/accounts/accountsDetail?id=${addr}`,
        '_blank'
      );
    }
    if (chain === 'ETH') {
      window.open(`https://rinkeby.etherscan.io/address/${addr}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://testnet.bscscan.com/address/${addr}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://testnet.hecoinfo.com/address/${addr}`, '_blank');
    }
  } else {
    if (chain === 'TOP') {
      window.open(
        `https://www.topscan.io/en-US/accounts/accountsDetail?id=${addr}`,
        '_blank'
      );
    }
    if (chain === 'ETH') {
      window.open(`https://etherscan.io/address/${addr}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://bscscan.com/address/${addr}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://hecoinfo.com/address/${addr}`, '_blank');
    }
  }
};

export const openHash = (hash, chain) => {
  if (isDev) {
    if (chain === 'TOP') {
      window.open(
        `https://bouwww.topscan.io/en-US/transactions/transactionsDetail?hash=${hash}`,
        '_blank'
      );
    }
    if (chain === 'ETH') {
      window.open(`https://rinkeby.etherscan.io/tx/${hash}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://testnet.bscscan.com/tx/${hash}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://testnet.hecoinfo.com/tx/${hash}`, '_blank');
    }
  } else {
    if (chain === 'TOP') {
      window.open(
        `https://www.topscan.io/en-US/transactions/transactionsDetail?hash=${hash}`,
        '_blank'
      );
    }
    if (chain === 'ETH') {
      window.open(`https://etherscan.io/tx/${hash}`, '_blank');
    }
    if (chain === 'BSC') {
      window.open(`https://bscscan.com/tx/${hash}`, '_blank');
    }
    if (chain === 'HECO') {
      window.open(`https://hecoinfo.com/tx/${hash}`, '_blank');
    }
  }
};

export const ethAddressToTopT6 = (ethAddress: string) => {
  if (!ethAddress) {
    return ethAddress;
  }
  return ethAddress.replace(/0x/, 'T60004');
};

export const sleep = (t: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('');
    }, t);
  });
};

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(relativeTime, config);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: '%d seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});
export const djs = (
  e: string | number | dayjs.Dayjs | Date | null | undefined
) => {
  if (e && typeof e === 'string' && e.length === 10) {
    e = Number(e) * 1000;
  }

  return dayjs(e);
};

export const handleCopy = addr => {
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    const textarea = document.createElement('textarea');
    textarea.textContent = addr;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex);
    } finally {
      document.body.removeChild(textarea);
    }
  }
};