export const formatAddress = (address = '', prefixNum = 6) => {
    if (!address) return ''
    return `${address.slice(0, prefixNum)}...${address.slice(address.length - 4, address.length)}`
}

export const formatHash = (address = '', prefixNum = 12) => {
    if (!address) return ''
    return `${address.slice(0, prefixNum)}...${address.slice(address.length - 12, address.length)}`
}

export const getFullAddress = (address = '', walletType = 'metaMask') => {
    if (!address) return ''
    return address
}

export const isValidMetamaskAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/g.test(address)
}

export const isValidVtimesAddress = (address: string) => {
    return /^V[a-zA-Z0-9]{33}$/g.test(address)
}

export const getTransferedAddress = (address: string) => {
    return address
}
