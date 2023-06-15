// import {DEFAULT_TXN_DISMISS_MS, L2_TXN_DISMISS_MS} from 'constants/misc'
import LibUpdater from '@/components/enhanced/TransactionUpdator';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IStoreState } from '@/store';
import { selectPendingEndResult, updatePendingEndResult } from '@/store/globalConfig';
import { useAllTransactions } from '@/store/transactions/hooks';
import { CHAINS } from '@/web3/constants';

import useAlert from '@/hooks/useAlert';
import useTxList from '@/hooks/useTxList';
import { useActiveWeb3React } from '@/web3/WalletProvider';

// import {L2_CHAIN_IDS} from '../../constants/chains'
// import {useAddPopup} from '../application/hooks'
import { checkedTransaction, finalizeTransaction } from './actions';

export default function Updater() {
  const { currentChainId } = useActiveWeb3React();
  // const addPopup = useAddPopup()
  // speed up popup dismisall time if on L2
  // const isL2 = Boolean(currentChainId && L2_CHAIN_IDS.includes(currentChainId))
  const { setAlert } = useAlert();
  const dispatch = useDispatch();
  const { addNewTx } = useTxList();
  const onCheck = useCallback(
    ({ chainId, hash, blockNumber }) =>
      dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch],
  );
  const transactions = useAllTransactions();
  const currentTxViewer = useMemo(() => {
    return CHAINS?.[currentChainId]?.blockExplorerUrls || '';
  }, [currentChainId, CHAINS]);
  // const { updateTokenBalance } = useBalance();
  const pendingEndResult = useSelector(selectPendingEndResult);
  const onReceipt = useCallback(
    async ({ chainId, hash, receipt }) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: {
            blockHash: receipt.blockHash,
            blockNumber: receipt.blockNumber,
            contractAddress: receipt.contractAddress,
            from: receipt.from,
            status: receipt.status,
            to: receipt.to,
            transactionHash: receipt.transactionHash,
            transactionIndex: receipt.transactionIndex,
          },
        }),
      );

      setAlert({
        type: 'success',
        message: transactions?.[hash].info.description,
        link: currentTxViewer ? `${currentTxViewer}${hash}` : '',
      });
      addNewTx({
        description: transactions?.[hash].info.description,
        status: true,
        hash,
        timestamp: new Date().getTime(),
        chainId,
      });
      // updateTokenBalance();
      dispatch(updatePendingEndResult(pendingEndResult + 1));
    },
    [
      // addPopup,
      dispatch,
      transactions,
      pendingEndResult,
      // isL2,
    ],
  );

  const onReceiptConfirmed = useCallback(() => {
    // updateTokenBalance();
    dispatch(updatePendingEndResult(Math.random()));
  }, [dispatch, pendingEndResult]);

  const state: any = useSelector<IStoreState>((state) => state.transactions);
  const pendingTransactions = useMemo(
    () => (currentChainId ? state[currentChainId] ?? {} : {}),
    [currentChainId, state],
  );

  return (
    <LibUpdater
      pendingTransactions={pendingTransactions}
      onCheck={onCheck}
      onReceipt={onReceipt}
      onReceiptConfirmed={onReceiptConfirmed}
    />
  );
}
