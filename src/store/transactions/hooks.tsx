import { TransactionResponse } from '@ethersproject/providers';
// import {useTransactionMonitoringEventCallback} from '@/hooks/useMonitoringEventCallback'
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStoreState } from '@/store';
import { isSameAddress } from '@/utils/format';

// import {Token} from '@uniswap/sdk-core'
import { useActiveWeb3React } from '@/web3/WalletProvider';

import { addTransaction, TransactionInfo } from './actions';
import { TransactionDetails, TransactionState } from './reducer';

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse | null,
  info: TransactionInfo,
) => void {
  const { currentChainId, account } = useActiveWeb3React();
  const dispatch = useDispatch();

  // const logMonitoringEvent = useTransactionMonitoringEventCallback()

  return useCallback(
    (response: TransactionResponse | null, info: TransactionInfo) => {
      if (!account) return;
      if (!currentChainId) return;
      const { hash } = response || { hash: '' };
      if (!hash) {
        throw Error('No transaction hash found.');
      }
      dispatch(addTransaction({ hash, from: account, info, chainId: currentChainId }));
      // logMonitoringEvent(info, response)
    },
    [
      account,
      currentChainId,
      dispatch,
      // logMonitoringEvent
    ],
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { currentChainId } = useActiveWeb3React();

  const state: any = useSelector<IStoreState>((state) => state.transactions);
  return currentChainId ? state[currentChainId] ?? {} : {};
}

export function useTransaction(transactionHash?: string): TransactionDetails | undefined {
  const allTransactions = useAllTransactions();

  if (!transactionHash) {
    return undefined;
  }

  return allTransactions[transactionHash];
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return !transactions[transactionHash].receipt;
}

export function useIsTransactionConfirmed(transactionHash?: string): boolean {
  const transactions = useAllTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return Boolean(transactions[transactionHash].receipt);
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

export function isTransactionFromCurAccount(
  tx: TransactionDetails,
  account: string,
): boolean {
  return isSameAddress(tx.from, account);
}

// returns whether a token has a pending approval transaction
// export function useHasPendingApproval(token?: any, spender?: string): boolean {
//     const allTransactions = useAllTransactions()
//     return useMemo(
//         () =>
//             typeof token?.address === 'string' &&
//             typeof spender === 'string' &&
//             Object.keys(allTransactions).some((hash) => {
//                 const tx = allTransactions[hash]
//                 if (!tx) return false
//                 if (tx.receipt) {
//                     return false
//                 } else {
//                     if (tx.info.type !== TransactionType.APPROVAL) return false
//                     return (
//                         tx.info.spender === spender && tx.info.tokenAddress === token.address && isTransactionRecent(tx)
//                     )
//                 }
//             }),
//         [allTransactions, spender, token?.address]
//     )
// }

// // watch for submissions to claim
// // return null if not done loading, return undefined if not found
// export function useUserHasSubmittedClaim(account?: string): {
//   claimSubmitted: boolean
//   claimTxn: TransactionDetails | undefined
// } {
//   const allTransactions = useAllTransactions()

//   // get the txn if it has been submitted
//   const claimTxn = useMemo(() => {
//     const txnIndex = Object.keys(allTransactions).find((hash) => {
//       const tx = allTransactions[hash]
//       return tx.info.type === TransactionType.CLAIM && tx.info.recipient === account
//     })
//     return txnIndex && allTransactions[txnIndex] ? allTransactions[txnIndex] : undefined
//   }, [account, allTransactions])

//   return { claimSubmitted: Boolean(claimTxn), claimTxn }
// }
