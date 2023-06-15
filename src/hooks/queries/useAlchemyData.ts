import { useEffect, useRef, useState } from 'react';

import { NftAddr } from '@/hooks/useCjcNftAddr';
import { useRequest } from '@/hooks/useRequest';

import { axiosRequest } from './../useRequest';

const apiKey = process.env.REACT_APP_ALCHEMY_KEY || 'Le7ph-PqYzkC6YEA3yzs_XdKm59BdoRp';
const GET_NFTS_API = `https://eth-goerli.alchemyapi.io/nft/v2/${apiKey}/getNFTs/`;
const GET_METADATA_API = `https://eth-goerli.alchemyapi.io/nft/v2/${apiKey}/getNFTMetadata/`;
const GET_NFT_OWNERS_API = `https://eth-goerli.alchemyapi.io/nft/v2/${apiKey}/getOwnersForToken/`;

interface UserNftsParams {
  owner: string;
  refetch?: number;
  contractAddresses?: string[];
}
export const useUserNfts = (
  { params, key }: { params: UserNftsParams; key: any },
  queryConfig = {},
) => {
  return useRequest<{ ownedNfts: any }>(
    [GET_NFTS_API, key],
    {
      url: GET_NFTS_API,
      params: { ...params, contractAddresses: Object.values(NftAddr) },
      method: 'get',
    },
    { ...queryConfig, initialData: [] },
  );
};

export const useAllUserNfts = (account: string, key: any) => {
  const pageKeyRef = useRef('');
  const [ownedNfts, setTotalNfts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const getNftFunc = async () => {
    let total_nft: any[] = [];
    let hasNext = true;
    setIsFetching(true);
    do {
      try {
        const getNFTsRes: any = await axiosRequest(GET_NFTS_API, {
          owner: account,
          pageKey: pageKeyRef.current,
          contractAddresses: Object.values(NftAddr),
        });
        hasNext = getNFTsRes.ownedNfts?.length > 0 && getNFTsRes.pageKey;
        total_nft = total_nft.concat(getNFTsRes.ownedNfts);
        pageKeyRef.current = getNFTsRes.pageKey;
      } catch (error) {
        console.debug(error);
        return [];
      }
    } while (hasNext);
    setIsFetching(false);
    return total_nft;
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    (async () => {
      const nfts: any = await getNftFunc();
      setTotalNfts(nfts);
    })();
  }, [account, key]);

  return { ownedNfts, isFetching };
};

interface NftMetadataParams {
  contractAddress: string;
  tokenId: string;
}
type NftMetadataData = {
  metadata: any;
  contract: { address: string };
  id: Record<string, string | number>;
};
export const useNftMetadata = (params: NftMetadataParams, queryConfig = {}) => {
  return useRequest<NftMetadataData>(
    GET_METADATA_API + `?key=${params.contractAddress + params.tokenId}`,
    { url: GET_METADATA_API, params: { ...params, refreshCache: true }, method: 'get' },
    { ...queryConfig, initialData: [] },
  );
};

// export const useAllUserNfts = (account, key) => {
//     const [ownedNfts, setTotalNfts] = useState({allFetched: false, nfts: []})
//     const [params, setParams] = useState({
//         owner: '',
//         pageKey: '',
//         contractAddresses: Object.values(NftAddr),
//     })
//     const keyRef = useRef(0)
//     console.log(key, account, params, 'check account')
//     const {data, isFetching} = useUserNfts(
//         {params, key: params.pageKey},
//         {
//             enabled: Boolean(params.owner),
//             keepPreviousData: true,
//         }
//     )

//     useEffect(() => {
//         console.log(data, ownedNfts, 'check datas')
//         if (data.ownedNfts?.length > 0 && data.pageKey) {
//             setParams((v) => {
//                 return {
//                     ...v,
//                     pageKey: data.pageKey,
//                 }
//             })
//             setTotalNfts((v) => {
//                 return {
//                     ...v,
//                     nfts: v.nfts.concat(data.ownedNfts),
//                 }
//             })
//         } else {
//             console.log(data, ownedNfts, 'check datas insidt')
//             setTotalNfts((v) => {
//                 return {
//                     ...v,
//                     nfts: v.nfts.concat(data?.ownedNfts || []),
//                     allFetched: true,
//                 }
//             })
//         }
//     }, [data])

//     useEffect(() => {
//         setParams({
//             owner: account,
//             pageKey: '',
//             contractAddresses: Object.values(NftAddr),
//         })
//         setTotalNfts({allFetched: false, nfts: []})
//     }, [account, key])

//     // const getNftFunc = async () => {
//     //     let total_nft = []
//     //     let hasNext = true
//     //     setIsFetching(true)
//     //     do {
//     //         try {
//     //             const getNFTsRes: any = await axiosRequest(GET_NFTS_API, {
//     //                 owner: account,
//     //                 pageKey: pageKeyRef.current,
//     //                 contractAddresses: Object.values(NftAddr),
//     //             })
//     //             hasNext = getNFTsRes.ownedNfts?.length > 0 && getNFTsRes.pageKey
//     //             total_nft = total_nft.concat(getNFTsRes.ownedNfts)
//     //             pageKeyRef.current = getNFTsRes.pageKey
//     //         } catch (error) {
//     //             console.debug(error)
//     //             return []
//     //         }
//     //     } while (hasNext)
//     //     setIsFetching(false)
//     //     return total_nft
//     // }

//     useEffect(() => {
//         if (!account) {
//             return
//         }
//         ;(async () => {
//             // const nfts = await getNftFunc()
//             // setTotalNfts(nfts)
//         })()
//     }, [key, account])

//     if (ownedNfts.allFetched) {
//         return {ownedNfts: ownedNfts.nfts, isFetching}
//     }

//     return {ownedNfts: [], isFetching}
// }
