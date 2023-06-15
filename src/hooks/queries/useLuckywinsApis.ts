import { useMarketApiRequest } from '@/hooks/useRequest';

export type PageData<Content> = {
  content: Content;
  pageNumber: number;
  pageSize: number;
  total: number;
};

const RACE_LIST = '/api/lucky/race/page';
const RACE_DETAIL = '/api/lucky/race/detail';
const RECENTLY_RESULT = '/api/lucky/race/recentlyResult';
const BET_HISTORY = '/api/lucky/raceTicket/betList';
const BET_DETAIL = '/api/lucky/raceTicket/betDetailList';
const GET_BALANCE = '/api/lucky/raceTicket/getBonus';

interface RaceListPageParams {
  'orderBys[0].alias'?: string;
  'orderBys[0].direction'?: string;
  'orderBys[0].property'?: string;
  'pageable.pageNumber'?: number;
  'pageable.pageSize'?: number;
  status: number[]; // 0 预备， 1进行中， 2 已结束，3 可购票，4 可领奖
}
export type RaceListResult = {
  id: number;
  createdTime: string;
  modifyTime: string;
  version: number;
  delFlag: number; // 0
  priceTicketInCjc: number;
  chainStartTime: string;
  buyEndTime: string;
  matchType: 'cup';
  matchTime: string;
  startTime: string;
  endTime: string;
  status: number; // 3
  matchName: string; // "RaceEysyUpLoys"
  matchAddress: string; // "RaceEysyUpLoys"
  matchCountry: string; // "Paris"
  siteType: string; // 'Dirt';
  runwayDirection: string; // 'anticlockwise';
  distance: string; // '5000M';
  createTime: string;
  matchPlanId: string;
  count: number;
};
export const useRaceList = (
  { params, key }: { params?: RaceListPageParams; key?: any },
  queryConfig = {},
) => {
  const urlQuery = params?.status
    .map((x) => {
      return `status=${x}`;
    })
    .join('&');
  return useMarketApiRequest<PageData<RaceListResult[]>>(
    [RACE_LIST, urlQuery],
    { url: `${RACE_LIST}`, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

interface RaceDetailParams {
  id: number;
}
export interface PlayerProps {
  id: number; //13,
  createdTime: string; //"2023-05-24 17:56:53",
  modifyTime: string; //"2023-05-24 17:56:53",
  version: number; //0,
  delFlag: number; //0,
  userId: string; //"7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451",
  raceId: number; //7,
  playerNumber: number; //1,
  horseId: number; //70,
  jockeyId: number; //145,
  score: number; //6,
  createTime: string; //"2023-05-24 17:56:53",
  raceTime: number; //126000,
  odds: number; //8000
  horseAttr: string;
  jockeyAttr: string;
}

export interface BetProps extends PlayerProps {
  priceTicketInCjc: number;
  matchName: string;
  matchCountry: string;
  matchAddress: string;
}
export interface RaceDetailResult {
  id: number; // 6;
  createdTime: string; // '2023-05-24 17:40:32';
  modifyTime: string; // '2023-05-24 18:40:00';
  version: number; // 0;
  delFlag: number; // 0;
  priceTicketInCjc: number; // 10;
  chainStartTime: string; // '2023-05-24 17:40:36';
  buyEndTime: string; // '2023-05-24 18:40:31';
  matchType: string; // 'cup';
  matchTime: string; // '2023-05-24';
  startTime: string; // '2023-05-24 18:40:32';
  endTime: string; // '2023-05-24 19:40:32';
  status: number; // 3;
  matchName: string; // 'RaceEysyUpLoys';
  siteType: string; // 'Dirt';
  runwayDirection: string; // 'anticlockwise';
  distance: string; // '5000M';
  createTime: string; // '2023-05-24 17:40:32';
  matchPlanId: string; // '1b7082cc335365e82f9b0f4e95f40b0503f32dc67abebba7159e2dc26737d795';
  players: PlayerProps[]; // [];
  matchCountry: string;
  matchAddress: string;
}
export const useRaceDetail = (
  { params, key }: { params?: RaceDetailParams; key?: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<RaceDetailResult>(
    [RACE_DETAIL, key],
    { url: RACE_DETAIL, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

interface RecentlyResultParams {
  gameUserId: string;
}
export type RecentlyResultData = {
  startTime: string; //"2023-05-26 16:21:36",
  matchName: string; // "RacedXis3ki6zh",
  score: number; // 16
};
export const useRecentlyResult = (
  { params, key }: { params?: RecentlyResultParams; key?: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<RecentlyResultData[]>(
    [RECENTLY_RESULT, key],
    { url: RECENTLY_RESULT, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

interface BetHistoryPageParams {
  owner?: `0x${string}`;
  'orderBys[0].alias'?: string;
  'orderBys[0].direction'?: string;
  'orderBys[0].property'?: string;
  'pageable.pageNumber'?: number;
  'pageable.pageSize'?: number;
}
export type BetHistoryResult = {
  betFee: number; // 30;
  betTime: string; //  '2023-06-01 18:16:49';
  tx: string; // '0x20f97c00b82b7eafcad14be5c74c199781f769a7aeebc1e066d1f63f65dd355f';
  totalResult: number;
};
export const useBetHistory = (
  { params, key }: { params?: BetHistoryPageParams; key?: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<PageData<BetHistoryResult[]>>(
    [BET_HISTORY, key],
    { url: BET_HISTORY, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

interface BetDetailPageParams {
  owner?: `0x${string}`;
  tx: string;
}
export type BetDetailResult = {
  betAmount: number; // 30;
  betNo: number; //  8;
  champion: string; //  '15';
  horseId: string; //  '51';
  jockeyId: string; //  '4';
  matchName: string; //  'RaceAYNgR8IE2Y';
  odds: string; //  '56000.000000000000000000';
  result: string; //  '-30';
  resultTime: string; //  '2023-06-01 20:17:15';
  startTime: string; //  '2023-06-01 19:17:15';
  status: number; //  4;
};
export const useBetDetail = (
  { params, key }: { params?: BetDetailPageParams; key?: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<BetDetailResult[]>(
    [BET_DETAIL, key],
    { url: BET_DETAIL, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

interface GetBalancePageParams {
  owner?: `0x${string}`;
}
export type GetBalanceResult = {
  totalCjc: number;
  content: {
    awardAmount: number;
    raceId: number;
    ticketId: number;
  }[];
};
export const useGetBalance = (
  { params, key }: { params?: GetBalancePageParams; key?: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<GetBalanceResult>(
    [GET_BALANCE, key],
    { url: GET_BALANCE, params, method: 'get' },
    { initialData: {}, ...queryConfig },
  );
};
