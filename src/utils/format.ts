import { getAddress } from '@ethersproject/address';
import { namehash } from '@ethersproject/hash';
import Decimal from 'decimal.js';

import { BALANCE_PRECISION_MAP } from '../web3/constants';

/*
format a string|number to a string without scientific notation
*/
export function noScifiFormat(x: number | string): string {
  if (!x) return '';
  if (Math.abs(+x) < 1.0) {
    const e = parseInt(x.toString().split('e-')[1], 10);
    if (e) {
      const a = new Decimal(10).pow(new Decimal(e).minus(1).valueOf()).valueOf();
      x = new Decimal(x).mul(a).valueOf();
      x = `0.${new Array(e).join('0')}${x.toString().substring(2)}`;
    }
  } else {
    let e = parseInt(x.toString().split('+')[1], 10);
    if (e > 20) {
      e -= 20;
      x = +x / 10 ** e;
      x = x.toString() + new Array(e + 1).join('0');
    }
  }
  return x.toString();
}

export function toThousands(val: number | string): string {
  if (!val) return '';
  const str = `${val}`;
  return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function bankFormat(val: string): string {
  if (!val) return '';
  const str = `${val}`;
  return str
    .replace(/[^\dA-Z]/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
}

export function toThousandsWithFloat(val: string | number): string {
  if (!val && val !== 0) return '';

  const str = `${val}`;
  if (str.indexOf('.') !== -1) {
    return `${str.split('.')[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}.${
      str.split('.')[1]
    }`;
  }
  return str.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

export function getCollateralPlaceholder(asset: string) {
  const _symbol = BALANCE_PRECISION_MAP?.[asset.toUpperCase()];
  if (!_symbol) {
    return '0.00';
  }
  return `0.${'0'.repeat(_symbol.amountPrecision)}`;
}

export function getPrecisionedAmount(amount: number, asset: string) {
  const _symbol = BALANCE_PRECISION_MAP?.[asset.toUpperCase()];
  if (!_symbol) {
    return amount;
  }
  return new Decimal(amount).toFixed(_symbol.amountPrecision, Decimal.ROUND_DOWN);
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString);
}

export function safeNamehash(name?: string): string | undefined {
  if (!name || name === undefined) return undefined;

  try {
    return namehash(name);
  } catch (error) {
    console.debug(name, error);
    return undefined;
  }
}

export function getCeilFixedAmount(amount: string | number): string {
  const fixedNumber = new Decimal(+amount).div(1e18).toFixed(2, Decimal.ROUND_CEIL);

  return new Decimal(fixedNumber).times(1e18).valueOf();
}

export function isSameAddress(addr1: string | unknown, addr2: string | unknown) {
  if (!addr1 || typeof addr1 !== 'string' || !addr2 || typeof addr2 !== 'string') {
    return false;
  }
  return addr1.toLowerCase() === addr2.toLowerCase();
}

export function transferAttrArrToObject(
  attrs: { value: string; trait_type: string }[],
): Record<string, string> {
  if (!attrs.length) {
    return {};
  }
  return attrs.reduce((s: Record<string, string>, x) => {
    if (!x.trait_type || !x.value) {
      return s;
    }
    s[x.trait_type] = x.value;
    return s;
  }, {});
}
