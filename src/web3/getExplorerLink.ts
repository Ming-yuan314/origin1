/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GOERLI = 5,
    KOVAN = 42,

    ARBITRUM_ONE = 42161,
    ARBITRUM_RINKEBY = 421611,

    OPTIMISM = 10,
    OPTIMISTIC_KOVAN = 69,

    POLYGON = 137,
    POLYGON_MUMBAI = 80001,
}

export const CHAIN_IDS_TO_NAMES = {
    [SupportedChainId.MAINNET]: 'mainnet',
    [SupportedChainId.ROPSTEN]: 'ropsten',
    [SupportedChainId.RINKEBY]: 'rinkeby',
    [SupportedChainId.GOERLI]: 'goerli',
    [SupportedChainId.KOVAN]: 'kovan',
    [SupportedChainId.POLYGON]: 'polygon',
    [SupportedChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
    [SupportedChainId.ARBITRUM_ONE]: 'arbitrum',
    [SupportedChainId.ARBITRUM_RINKEBY]: 'arbitrum_rinkeby',
    [SupportedChainId.OPTIMISM]: 'optimism',
    [SupportedChainId.OPTIMISTIC_KOVAN]: 'optimistic_kovan',
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
    (id) => typeof id === 'number'
) as SupportedChainId[]

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.MAINNET, SupportedChainId.POLYGON]

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
    SupportedChainId.MAINNET,
    SupportedChainId.ROPSTEN,
    SupportedChainId.RINKEBY,
    SupportedChainId.GOERLI,
    SupportedChainId.KOVAN,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
] as const

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number]

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
] as const

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number]

export enum ExplorerDataType {
    TRANSACTION = 'transaction',
    TOKEN = 'token',
    ADDRESS = 'address',
    BLOCK = 'block',
}

const ETHERSCAN_PREFIXES: {[chainId: number]: string} = {
    [SupportedChainId.MAINNET]: 'https://etherscan.io',
    [SupportedChainId.ROPSTEN]: 'https://ropsten.etherscan.io',
    [SupportedChainId.RINKEBY]: 'https://rinkeby.etherscan.io',
    [SupportedChainId.GOERLI]: 'https://goerli.etherscan.io',
    [SupportedChainId.KOVAN]: 'https://kovan.etherscan.io',
    [SupportedChainId.OPTIMISM]: 'https://optimistic.etherscan.io',
    [SupportedChainId.OPTIMISTIC_KOVAN]: 'https://kovan-optimistic.etherscan.io',
    [SupportedChainId.POLYGON_MUMBAI]: 'https://mumbai.polygonscan.com',
    [SupportedChainId.POLYGON]: 'https://polygonscan.com',
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(chainId: number, data: string, type: ExplorerDataType): string {
    if (chainId === SupportedChainId.ARBITRUM_ONE) {
        switch (type) {
            case ExplorerDataType.TRANSACTION:
                return `https://arbiscan.io/tx/${data}`
            case ExplorerDataType.ADDRESS:
            case ExplorerDataType.TOKEN:
                return `https://arbiscan.io/address/${data}`
            case ExplorerDataType.BLOCK:
                return `https://arbiscan.io/block/${data}`
            default:
                return `https://arbiscan.io/`
        }
    }

    if (chainId === SupportedChainId.ARBITRUM_RINKEBY) {
        switch (type) {
            case ExplorerDataType.TRANSACTION:
                return `https://rinkeby-explorer.arbitrum.io/tx/${data}`
            case ExplorerDataType.ADDRESS:
            case ExplorerDataType.TOKEN:
                return `https://rinkeby-explorer.arbitrum.io/address/${data}`
            case ExplorerDataType.BLOCK:
                return `https://rinkeby-explorer.arbitrum.io/block/${data}`
            default:
                return `https://rinkeby-explorer.arbitrum.io/`
        }
    }

    const prefix = ETHERSCAN_PREFIXES[chainId] ?? 'https://etherscan.io'

    switch (type) {
        case ExplorerDataType.TRANSACTION:
            return `${prefix}/tx/${data}`

        case ExplorerDataType.TOKEN:
            return `${prefix}/token/${data}`

        case ExplorerDataType.BLOCK:
            if (chainId === SupportedChainId.OPTIMISM || chainId === SupportedChainId.OPTIMISTIC_KOVAN) {
                return `${prefix}/tx/${data}`
            }
            return `${prefix}/block/${data}`

        case ExplorerDataType.ADDRESS:
            return `${prefix}/address/${data}`
        default:
            return `${prefix}`
    }
}
