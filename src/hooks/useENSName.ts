import { Contract } from '@ethersproject/contracts';
import { namehash } from '@ethersproject/hash';
import { useEffect, useMemo, useState } from 'react';
import { isAddress, isZero } from '@/utils/format';
import ENS_PUBLIC_RESOLVER_ABI from '@/web3/abi/ens_public_resolver.json';
import ENS_ABI from '@/web3/abi/ens_registrar.json';
import { ENS_REGISTRAR_ADDRESSES } from '@/web3/addresses';

import { useActiveWeb3React } from '@/web3/WalletProvider';

import useDebounce from './useDebounce';
import useENSAddress from './useENSAddress';

/**
 * Does a reverse lookup for an address to find its ENS name.
 * Note this is not the same as looking up an ENS name to find an address.
 */
export default function useENSName(address?: string): {
  ENSName: string | null;
  loading: boolean;
} {
  const { isActive, web3Provider, currentChainId } = useActiveWeb3React();
  const debouncedAddress = useDebounce(address, 200);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const ensNodeArgument = useMemo(() => {
    if (!debouncedAddress || !isAddress(debouncedAddress)) return [undefined];
    return namehash(`${debouncedAddress.toLowerCase().substr(2)}.addr.reverse`);
  }, [debouncedAddress]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    (async () => {
      const registrarContract = new Contract(
        ENS_REGISTRAR_ADDRESSES[currentChainId],
        ENS_ABI,
        web3Provider,
      );
      setLoading(true);
      try {
        const resolverAddressResult = registrarContract.resolver(ensNodeArgument);

        if (
          resolverAddressResult && !isZero(resolverAddressResult)
            ? resolverAddressResult
            : undefined
        ) {
          const resolverContract = new Contract(
            resolverAddressResult,
            ENS_PUBLIC_RESOLVER_ABI,
            web3Provider,
          );
          const nameCallRes = await resolverContract.name(ensNodeArgument);
          setName(nameCallRes);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [debouncedAddress, isActive]);

  /* ENS does not enforce that an address owns a .eth domain before setting it as a reverse proxy 
     and recommends that you perform a match on the forward resolution
     see: https://docs.ens.domains/dapp-developer-guide/resolving-names#reverse-resolution
  */
  const fwdAddr = useENSAddress(name);
  const checkedName = address === fwdAddr?.address ? name : null;
  const changed = debouncedAddress !== address;
  return useMemo(
    () => ({
      ENSName: changed ? null : checkedName,
      loading: changed || loading,
    }),
    [changed, checkedName],
  );
}
