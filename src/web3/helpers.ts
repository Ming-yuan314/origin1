import { Contract } from '@ethersproject/contracts';
import { formatUnits } from '@ethersproject/units';
import ERC20_ABI from '@/web3/abi/erc20.json';
import Decimal from 'decimal.js';
import { Web3Provider } from '@ethersproject/providers';
export const GAS_LIMIT_COSTS = 21000;

// balance helpers
const DEFAULT_DECIMALS = 18;
export const getNativeTokenBalance = async (account: string, provider: Web3Provider) => {
  try {
    if (!account || !provider) {
      return;
    }
    const _balance = await provider.getBalance(account);

    if (+_balance || +_balance === 0) {
      return +formatUnits(_balance, DEFAULT_DECIMALS);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getErc20TokenBalance = async (
  token: { address: string },
  account: string,
  provider: Web3Provider,
) => {
  try {
    if (!account || !provider) {
      return;
    }
    const _contract = new Contract(token.address, ERC20_ABI, provider);
    const _balance = await _contract.balanceOf(account);
    const _decimals = await _contract.decimals();

    if (+_balance || +_balance === 0) {
      return +formatUnits(_balance, _decimals);
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

export const precisionedValue = (amount: number, precision = 18) => {
  if (!amount) {
    return 0;
  }
  return +new Decimal(amount).div(10 ** precision).valueOf();
};
