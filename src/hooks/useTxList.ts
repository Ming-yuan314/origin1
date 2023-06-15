import Lockr from 'lockr';
import { useCallback, useEffect, useState } from 'react';

interface TxRecord {
  description: string;
  status: boolean;
  hash: string;
  timestamp: number;
  chainId: number;
}

function getTxList(): TxRecord[] {
  const _txList = JSON.parse(Lockr.get('CLINK_TX_LIST') || '[]');
  return _txList;
}

function storeTxList(list: TxRecord[]) {
  Lockr.set('CLINK_TX_LIST', JSON.stringify(list));
}

export default function useTxList() {
  const [txList, setTxList] = useState<TxRecord[]>([]);

  useEffect(() => {
    const txList = getTxList();
    setTxList(txList);
  }, []);

  const addNewTx = useCallback(
    (newTx: TxRecord) => {
      const newList = [newTx, ...txList].slice(0, 10);
      setTxList(newList);
      storeTxList(newList);
    },
    [txList],
  );

  const clearTxList = useCallback(() => {
    setTxList([]);
    storeTxList([]);
  }, []);

  return { txList, addNewTx, clearTxList };
}
