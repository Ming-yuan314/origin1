import axios, { AxiosRequestConfig } from 'axios';
import Lockr from 'lockr';
import qs from 'query-string';
// import useSWR, {ConfigInterface, responseInterface} from 'swr'
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
// import { useActiveWeb3React } from '@/web3/WalletProvider';
import { useNavigate } from 'react-router-dom';
import { useDisconnect } from 'wagmi';

import {
  selectDesiredChainId,
  updateWalletStatus,
  updateWalletType,
} from '../store/globalConfig';
import { selectUserInfo, updateUserInfo } from './../store/user';
// import {GRAPH_ENDPOINTS} from '@/hooks/queries/useBorrowData'
// import { request as graphRequest } from 'graphql-request';
// import DeviceDetector from 'device-detector-js'

// const deviceDetector = new DeviceDetector()
// const device = deviceDetector.parse(typeof window !== 'undefined' ? window.navigator.userAgent : '')

export type GetRequest = AxiosRequestConfig | null;

interface Return<Data, Error> {
  data: Data | undefined;
  error: Error | unknown;
  isSuccess?: boolean;
  isFetching?: boolean;
  isRefetching?: boolean;
  isPreviousData?: boolean;
}

interface MarketApiReturn<Data, Error> {
  data:
    | {
        code: number;
        msg: string;
        data: Data;
      }
    | undefined;
  error: Error | unknown;
  isSuccess?: boolean;
  isFetching?: boolean;
}

interface ResponseData {
  code: number;
  msg: string;
  data: unknown;
}

interface GraphqlResponse<Data> {
  data: Data;
}

export const envPrefix = process.env.REACT_APP_PREFIX || '';

export const axiosRequest = async (url: string, params: any, initialData = {}) => {
  const realRequest: AxiosRequestConfig = {
    params: params,
    method: 'get',
    url: `${envPrefix}${url}`,
  };
  const response = await axios(realRequest);

  return response?.status === 200 && response?.data ? response.data : initialData;
};

export function useRequest<Data = ResponseData, Error = unknown>(
  key: string | Array<unknown>,
  request: GetRequest | any,
  { initialData, ...config }: any = {},
): Return<Data, Error> {
  const realRequest: GetRequest = {
    ...request,
    url: `${envPrefix}${request.url}`,
    headers: {
      ...request.headers,
    },
    data: request?.data && qs.stringify(request.data),
  };

  const {
    data: response,
    error,
    ...queryParams
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = useQuery(key, () => axios(realRequest!), {
    ...config,
    initialData: initialData && {
      status: 200,
      statusText: 'InitialData',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      config: request!,
      headers: {},
      data: initialData,
    },
  });
  return {
    data:
      response?.status === 200 && response?.data
        ? response.data
        : initialData
        ? initialData
        : false,
    error,
    ...queryParams,
  };
}

export function useMarketApiRequest<Data = ResponseData, Error = unknown>(
  key: string | Array<unknown>,
  request: GetRequest | any,
  { initialData, ...config }: any = {},
): Return<Data, Error> {
  const params = request.params || {};
  const method = request.method || 'get';
  // const userInfo = useSelector(selectUserInfo);
  const { disconnect } = useDisconnect();
  const naviage = useNavigate();
  const dispatch = useDispatch();
  const realRequest: GetRequest = {
    ...request,
    params: method === 'get' ? {} : params,
    url: `${envPrefix}${request.url}${
      method === 'get' ? `?${qs.stringify(params)}` : ''
    }`,
    headers: {
      ...request.headers,
      // token: userInfo?.jwtToken || '',
    },
    data: request?.data && qs.stringify(request.data),
  };

  const {
    data: response,
    error,
    ...queryParams
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } = useQuery(key, () => axios(realRequest!), {
    ...config,
    initialData: initialData && {
      status: 200,
      statusText: 'InitialData',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      config: request!,
      headers: {},
      data: initialData,
    },
  });
  if (
    response?.status === 200 &&
    response?.data.code === '0' &&
    (response?.data?.msg?.includes('JWT expired') ||
      response?.data?.msg?.includes('Session not login'))
  ) {
    naviage('/');
    dispatch(updateWalletStatus(false));
    dispatch(updateWalletType(null));
    dispatch(updateUserInfo(null));
    Lockr.rm('ethConnectType');
    Lockr.rm('redux_localstorage_simple_user');
    disconnect();
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
    return {
      data: undefined,
      error,
      ...queryParams,
    };
  }

  return {
    data:
      response?.status === 200 && response?.data && response.data.code === '1'
        ? response.data.data
        : initialData
        ? initialData
        : false,
    error,
    ...queryParams,
  };
}

// export function useGraphRequest<Data = ResponseData, Error = unknown>(
//     key: Array<any>,
//     requestBody: GetRequest | any,
//     {initialData, ...config}: any = {},
//     targetEndpoint?: string,
//     isPagination?: boolean
// ): Return<Data, Error> {
//     const desiredChainId = useSelector(selectDesiredChainId)
//     const gqlRequest = async () => {
//         const data = await graphRequest(
//             requestBody ? targetEndpoint || GRAPH_ENDPOINTS[desiredChainId] : null,
//             requestBody
//         )
//         return data
//     }

//     const {
//         data: response,
//         error,
//         ...queryParams
//     } = useQuery<GraphqlResponse<Data>>([...key], gqlRequest, {
//         ...config,
//         initialData: initialData && {
//             status: 200,
//             statusText: 'InitialData',
//             // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//             config: gqlRequest!,
//             headers: {},
//             data: initialData,
//         },
//     })
//     const _keys = key[0].split('+')
//     return {
//         data: _keys.every((x) => response?.[x]) ? (_keys.length > 1 ? response : response[_keys[0]]) : initialData,
//         error,
//         ...queryParams,
//     }
// }

export function usePost(request: GetRequest): Promise<any> {
  const lang = '';
  const _channel = localStorage.Channel || '';

  const realRequest: GetRequest = {
    ...request,
    headers: {
      ...request?.headers,
    },
    data: request?.data,
  };

  if (_channel) {
    // @ts-ignore
    realRequest['headers']['Channel'] = _channel;
  }

  return axios(realRequest);
}

export function useGet(url: any): Promise<any> {
  return axios.get(url);
}

interface SimpleRequestProps {
  url: string;
  type: 'get' | 'post' | 'put';
  data: any;
  userToken?: string;
  language: string;
  headers?: any;
}
