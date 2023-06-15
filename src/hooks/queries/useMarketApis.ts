import { useMarketApiRequest } from '@/hooks/useRequest';

const GET_COLLECTIONS_CATEGORY = '/api/marketplace/collection/list';
const GET_NFT_DETAIL = '/api/marketplace/nftDetail/detail';
const GET_ORDER_LIST = '/api/marketplace/order/page';
const GET_ORDER_ACTIVITIES = '/api/marketplace/order/page';
const GET_ORDER_DETAIL = '/api/marketplace/order/detail';
const SAVE_ORDER = '/api/marketplace/order/save';
const STATIC_ANALYSIS = '/api/marketplace/order/statisticalAnalysis';
const USER_ACTIVITIES = '/api/marketplace/userActivities/page';
export const CHECK_PENDING_ORDER = '/api/marketplace/order/pendingOrder';

export type CollectionItem = {
  basisPoints: number;
  collectionsAddress: string;
  collectionsImage: string;
  collectionsName: string;
  collectionsType: number;
  createdTime: string;
  createrAddress: string;
  createrFeePoints: number;
  delFlag: number;
  id: number;
  modifyTime: string;
  orders: number;
  recptionAddress: string;
  state: number;
  total: number;
  tradeToken: string;
  version: number;
};
export const useCollectionsCategory = (key: any, queryConfig = {}) => {
  return useMarketApiRequest<CollectionItem[]>(
    [GET_COLLECTIONS_CATEGORY, key],
    { url: GET_COLLECTIONS_CATEGORY, params: {}, method: 'get' },
    { ...queryConfig, initialData: [] },
  );
};

type PageData<Content> = {
  content: Content;
  pageNumber: number;
  pageSize: number;
  total: number;
};

type NftDetailParams = { id: string };
type NftDetail = {
  attributes: string;
  collectionsAddress: string;
  createdTime: string;
  delFlag: number;
  id: number;
  imageUrl: string;
  modifyTime: string;
  nftId: number;
  orders: number;
  version: number;
};
export const useNftDetail = (
  { params, key }: { params: NftDetailParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<NftDetail>(
    [GET_NFT_DETAIL, key],
    { url: GET_NFT_DETAIL, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

type OrderListParams = {
  canceled?: string;
  clientSignature?: string;
  collectionsAddress?: string | string[];
  createdTime?: string;
  currentPrice?: string;
  dealTime?: string;
  expirationTime?: string;
  finalized?: number;
  idIn?: string;
  maker?: string;
  markedInvalid?: string;
  nftId?: string;
  nftNum?: string;
  'orderBys[0].alias'?: string;
  'orderBys[0].direction'?: string;
  'orderBys[0].orderEnable'?: string;
  'orderBys[0].property'?: string;
  orderHash?: string;
  orderType?: string;
  orders?: string;
  'pageable.pageNumber'?: number;
  'pageable.pageSize'?: number;
  protocolData?: string;
  side?: string;
  startTime?: string;
  taker?: string;
  token?: string;
  transHash?: string;
  zone?: string;
};
export type OrderItem = {
  attributes: string;
  canceled: number;
  clientSignature: string;
  collectionsAddress: string;
  createdTime: string;
  currentPrice: number;
  dealTime: string;
  delFlag: number;
  expirationTime: string;
  finalized: number;
  id: number;
  imageUrl: string;
  maker: string;
  markedInvalid: number;
  modifyTime: string;
  nftId: number;
  nftNum: number;
  orderHash: string;
  orderType: number;
  protocolData: string;
  startTime: string;
  taker: string;
  token: string;
  transHash: string;
  version: number;
  zone: string;
};
type OrderList = {
  content: OrderItem[];
  extData: any;
  pageNumber: number;
  pageSize: number;
  total: number;
};
export const useOrderList = (
  { params, key }: { params: OrderListParams; key: any },
  queryConfig = {},
) => {
  if (!params['orderBys[0].property']) {
    delete params['orderBys[0].property'];
    delete params['orderBys[0].direction'];
  }
  return useMarketApiRequest<OrderList>(
    [GET_ORDER_LIST, key],
    { url: GET_ORDER_LIST, params: { ...params }, method: 'get' },
    { ...queryConfig, initialData: [] },
  );
};

export const useOrderDetail = (
  { params, key }: { params: { id: string }; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<OrderItem>(
    [GET_ORDER_DETAIL + `?key=${key}`, key],
    (queryConfig as any).enabled ? { url: GET_ORDER_DETAIL, params, method: 'get' } : {},
    { initialData: [], ...queryConfig },
  );
};

export const useOrderActivities = (
  {
    params,
    key,
  }: { params: Omit<OrderListParams, 'orderHash'> & { orderHash: string }; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<OrderList>(
    [`${GET_ORDER_ACTIVITIES}?key=${params.orderHash}`, key],
    {
      url: GET_ORDER_ACTIVITIES,
      params: {
        ...params,
        'orderBys[0].property': 'createdTime',
        'orderBys[0].direction': 'ASC',
      },
      method: 'get',
    },
    { ...queryConfig, initialData: [] },
  );
};

export const useSoldList = (
  { params, key }: { params: OrderListParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<OrderList>(
    [GET_ORDER_LIST, key],
    {
      url: GET_ORDER_LIST,
      params,
      method: 'get',
    },
    { ...queryConfig, initialData: [] },
  );
};

export const useListedList = (
  { params, key }: { params: OrderListParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<OrderList>(
    [GET_ORDER_LIST, key],
    {
      url: GET_ORDER_LIST,
      params: {
        ...params,
        'orderBys[0].property': 'createdTime',
        'orderBys[0].direction': 'DESC',
        'pageable.pageSize': 5,
        finalized: 0,
      },
      method: 'get',
    },
    { ...queryConfig, initialData: [] },
  );
};

export enum StaticAnalysisType {
  '24H' = 1,
  '7D' = 2,
  '1M' = 3,
}
type StaticAnalysisParams = {
  collectionsAddress: string;
  type: StaticAnalysisType;
};
type StaticAnalysisData = {
  attributeCount: number;
  totalAmount: number;
  totalCount: number;
};
export const useStaticAnalysis = (
  { params, key }: { params: StaticAnalysisParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<StaticAnalysisData>(
    [STATIC_ANALYSIS, key],
    { url: STATIC_ANALYSIS, params, method: 'post' },
    { ...queryConfig, initialData: [] },
  );
};

type UserActsParams = {
  collectionsAddress: string;
  nftFrom: string;
  'orderBys[0].alias'?: string;
  'orderBys[0].direction'?: string;
  'orderBys[0].property'?: string;
  'pageable.pageNumber'?: number;
  'pageable.pageSize'?: number;
};
export type UserActsData = {
  collectionsAddress: string;
  createdTime: string;
  delFlag: string;
  id: string;
  modifyTime: string;
  nftFrom: string;
  nftId: string;
  nftNum: string;
  nftTo: string;
  optTime: string;
  optType: number;
  token: string;
  tokenAmount: string;
  transHash: string;
  version: string;
};
export const useUserActivities = (
  { params, key }: { params: UserActsParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<PageData<UserActsData[]>>(
    [USER_ACTIVITIES, key],
    { url: USER_ACTIVITIES, params, method: 'get' },
    { ...queryConfig, initialData: [] },
  );
};
