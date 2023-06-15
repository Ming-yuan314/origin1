import { CjcNftTypes } from '@/hooks/useCjcNftAddr';
import { createAction } from '@reduxjs/toolkit';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

/**
 * Be careful adding to this enum, always assign a unique value (typescript will not prevent duplicate values).
 * These values is persisted in state and if you change the value it will cause errors
 */
export enum TransactionType {
  SEND_GIFT = 0,
  BUY_NFT = 1,
  SELL_NFT = 2,
  CANCEL_SELL = 3,
  APPROVAL = 4,
  OPEN_BOX = 5,
  DEPOSIT = 6,
  WITHDRAW = 7,
  BURNING_NFT = 8,
  STAKE_SOUL = 9,
  UNSTAKE_SOUL = 10,
  SOUL_CLAIM = 11,
  REGENERATE_NFT = 12,
  REBORN_NFT = 13,
}

export const PLAYGROUND_RELATED_TYPES = [
  TransactionType.OPEN_BOX,
  TransactionType.REGENERATE_NFT,
  TransactionType.REBORN_NFT,
];
export interface BaseTransactionInfo {
  type: TransactionType;
}

export interface TransactionInfo extends BaseTransactionInfo {
  description: string;
  createTime: number;
  nftType?: CjcNftTypes;
  nftId?: number;
  orderId?: number;
  tx_id?: string;
  giftedAddr?: string;
  nftValue?: string; // amount + tokenSymbol
  nftNum?: number;
  nftPrice?: string; // value + symbol
  depositOrWithdrawCoin?: string;
  depositOrWithdrawValue?: string;
}

export const addTransaction = createAction<{
  chainId: number;
  hash: string;
  from: string;
  info: TransactionInfo;
}>('transactions/addTransaction');
export const clearAllTransactions = createAction<{ chainId: number }>(
  'transactions/clearAllTransactions',
);
export const finalizeTransaction = createAction<{
  chainId: number;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');
export const checkedTransaction = createAction<{
  chainId: number;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');
