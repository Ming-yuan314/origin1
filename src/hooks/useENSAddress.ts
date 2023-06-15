import { Contract } from '@ethersproject/contracts';
import { useEffect, useMemo, useState } from 'react';
import { isZero, safeNamehash } from '@/utils/format';
import ENS_PUBLIC_RESOLVER_ABI from '@/web3/abi/ens_public_resolver.json';
import ENS_ABI from '@/web3/abi/ens_registrar.json';
import { ENS_REGISTRAR_ADDRESSES } from '@/web3/addresses';

import { useActiveWeb3React } from '@/web3/WalletProvider';
import useDebounce from './useDebounce';

/**
 * Does a lookup for an ENS name to find its address.
 */
export default function useENSAddress(ensName?: string | null): {
  loading: boolean;
  address: string | null;
} {
  const { isActive, web3Provider, currentChainId } = useActiveWeb3React();
  const debouncedName = useDebounce(ensName, 200);
  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState('');

  const ensNodeArgument = useMemo(
    () => (debouncedName === null ? undefined : safeNamehash(debouncedName)),
    [debouncedName],
  );
  useEffect(() => {
    if (!isActive || !web3Provider) {
      return;
    }
    (async () => {
      const registrarContract = new Contract(
        ENS_REGISTRAR_ADDRESSES[currentChainId],
        ENS_ABI,
        web3Provider.getSigner(),
      );
      setLoading(true);
      try {
        const resolverAddressResult = await registrarContract.resolver(ensNodeArgument);

        if (
          resolverAddressResult && !isZero(resolverAddressResult)
            ? resolverAddressResult
            : undefined
        ) {
          const resolverContract = new Contract(
            resolverAddressResult,
            ENS_PUBLIC_RESOLVER_ABI,
            web3Provider.getSigner(),
          );
          const _addr = await resolverContract.addr(ensNodeArgument);
          setAddr(_addr);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [debouncedName, ensNodeArgument, isActive]);

  const changed = debouncedName !== ensName;
  return useMemo(
    () => ({
      address: changed ? null : addr ?? null,
      loading: changed || loading,
    }),
    [addr, changed, loading],
  );
}
