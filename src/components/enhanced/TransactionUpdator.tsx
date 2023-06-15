import {TransactionReceipt} from '@ethersproject/abstract-provider'
import {SupportedChainId} from '@/web3/getExplorerLink'
import {useActiveWeb3React} from '@/web3/WalletProvider'
// import {useBlockNumber, useFastForwardBlockNumber} from 'hooks/useBlockNumber'
import ms from 'ms.macro'
import qs from 'query-string'
import {useCallback, useEffect, useState} from 'react'
import {wait, retry, RetryableError, RetryOptions} from '@/utils/retry'
import { useBlockNumber } from 'wagmi'
import { CancelledError } from 'react-query'

interface Transaction {
    addedTime: number
    receipt?: unknown
    lastCheckedBlockNumber?: number
}

function shouldCheck(lastBlockNumber: number, tx: Transaction): boolean {
    if (tx.receipt) return false
    if (!tx.lastCheckedBlockNumber) return true
    const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
    if (blocksSinceCheck < 1) return false
    const minutesPending = (new Date().getTime() - tx.addedTime) / ms`1m`
    if (minutesPending > 60) {
        // every 10 blocks if pending longer than an hour
        return blocksSinceCheck > 9
    } else if (minutesPending > 5) {
        // every 3 blocks if pending longer than 5 minutes
        return blocksSinceCheck > 2
    } else {
        // otherwise every block
        return true
    }
}

const RETRY_OPTIONS_BY_CHAIN_ID: {[chainId: number]: RetryOptions} = {
    [SupportedChainId.ARBITRUM_ONE]: {n: 10, minWait: 250, maxWait: 1000},
    [SupportedChainId.ARBITRUM_RINKEBY]: {n: 10, minWait: 250, maxWait: 1000},
    [SupportedChainId.OPTIMISTIC_KOVAN]: {n: 10, minWait: 250, maxWait: 1000},
    [SupportedChainId.GOERLI]: {n: 10, minWait: 250, maxWait: 1000},
    [SupportedChainId.OPTIMISM]: {n: 10, minWait: 250, maxWait: 1000},
}
const DEFAULT_RETRY_OPTIONS: RetryOptions = {n: 1, minWait: 0, maxWait: 0}

const GET_CONFIRMATIONS_OPTIONS = {n: 999, minWait: 250, maxWait: 1000}
const GET_HTTPRESULT_OPTIONS = {n: 999, minWait: 5000, maxWait: 10000}

interface UpdaterProps {
    pendingTransactions: {[hash: string]: Transaction}
    onCheck: (tx: {chainId: number; hash: string; blockNumber: number}) => void
    onReceipt: (tx: {chainId: number; hash: string; receipt: TransactionReceipt}) => void
    onReceiptConfirmed: () => void
}

export default function Updater({pendingTransactions, onCheck, onReceipt, onReceiptConfirmed}: UpdaterProps): null {
    const {currentChainId, web3Provider} = useActiveWeb3React()

    const {data: blockNumber} = useBlockNumber()
    const lastBlockNumber = Number(blockNumber)
    // const fastForwardBlockNumber = useFastForwardBlockNumber()
    const [checkingConfirmsHash, setCheckingConfirmsHash] = useState('')

    const getReceipt = useCallback(
        (hash: string) => {
            if (!web3Provider || !currentChainId) throw new Error('No web3Provider or currentChainId')
            const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[currentChainId] ?? DEFAULT_RETRY_OPTIONS
            return retry(
                () =>
                    web3Provider.getTransactionReceipt(hash).then((receipt: TransactionReceipt) => {
                        if (receipt === null) {
                            console.debug(`Retrying tranasaction receipt for ${hash}`)
                            throw new RetryableError()
                        }
                        return receipt
                    }),
                retryOptions
            )
        },
        [currentChainId, web3Provider]
    )

    const getReceiptConfirms = useCallback(
        (hash: string) => {
            if (!web3Provider || !currentChainId) throw new Error('No web3Provider or currentChainId')
            return retry(
                () =>
                    web3Provider.getTransactionReceipt(hash).then((receipt: TransactionReceipt) => {
                        if (receipt?.confirmations < 2) {
                            console.debug(`Retrying tranasaction receipt confirms for ${hash}`)
                            throw new RetryableError()
                        }
                        return receipt
                    }),
                GET_CONFIRMATIONS_OPTIONS,
                () => wait(2000)
            )
        },
        [currentChainId, web3Provider]
    )

    useEffect(() => {
        if (!currentChainId || !web3Provider || !lastBlockNumber) return

        const cancels = Object.keys(pendingTransactions)
            .filter((hash) => !hash.includes('Sell'))
            .filter((hash) => shouldCheck(lastBlockNumber, pendingTransactions[hash]))
            .map((hash) => {
                const {promise, cancel} = getReceipt(hash)
                promise
                    .then((receipt: TransactionReceipt | unknown) => {
                        if (receipt) {
                            onReceipt({chainId: currentChainId, hash, receipt: receipt as TransactionReceipt})
                            setCheckingConfirmsHash(hash)
                        } else {
                            onCheck({chainId: currentChainId, hash, blockNumber: lastBlockNumber})
                        }
                    })
                    .catch((error: any) => {
                        if (!error.isCancelledError) {
                            console.warn(`Failed to get transaction receipt for ${hash}`, error)
                        }
                    })
                return cancel
            })

        return () => {
            cancels.forEach((cancel) => cancel())
        }
    }, [
        currentChainId,
        web3Provider,
        lastBlockNumber,
        getReceipt,
        onReceipt,
        onCheck,
        pendingTransactions,
    ])

    useEffect(() => {
        if (!currentChainId || !web3Provider || !lastBlockNumber || !checkingConfirmsHash) return

        const {promise, cancel} = getReceiptConfirms(checkingConfirmsHash)
        promise
            .then((receipt: TransactionReceipt | unknown) => {
                if (receipt) {
                    setCheckingConfirmsHash('')
                    onReceiptConfirmed()
                } else {
                    onCheck({chainId: currentChainId, hash: checkingConfirmsHash, blockNumber: lastBlockNumber})
                }
            })
            .catch((error: any) => {
                if (!error.isCancelledError) {
                    console.warn(`Failed to get transaction receipt for ${checkingConfirmsHash}`, error)
                }
            })

        return () => {
            cancel()
        }
    }, [checkingConfirmsHash])

    return null
}
