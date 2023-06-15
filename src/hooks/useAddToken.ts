import { useCallback, useState } from 'react';

import { useActiveWeb3React } from '@/web3/WalletProvider';

interface ERC20Token {
  address: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

export default function useAddToken(): {
  addToken: (token: ERC20Token | undefined, cb?: () => void) => void;
  success: boolean | undefined;
} {
  const { web3Provider } = useActiveWeb3React();
  // const token: ERC20Token | undefined = currencyToAdd?.wrapped

  const [success, setSuccess] = useState<boolean | undefined>();
  // const logoURL = useCurrencyLogoURIs(token)[0]

  const addToken = useCallback(
    (token: ERC20Token | undefined, cb?: () => void) => {
      if (
        web3Provider &&
        web3Provider.provider.isMetaMask &&
        web3Provider.provider.request &&
        token
      ) {
        web3Provider.provider
          .request({
            method: 'wallet_watchAsset',
            params: {
              //@ts-ignore // need this for incorrect ethers provider type
              type: 'ERC20',
              options: {
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals,
                image: token.logo || '',
              },
            },
          })
          .then((success: boolean) => {
            setSuccess(success);
            cb && cb();
          })
          .catch(() => setSuccess(false));
      } else {
        setSuccess(false);
      }
    },
    [web3Provider],
  );

  return { addToken, success };
}
