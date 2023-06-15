import { useMarketApiRequest } from '@/hooks/useRequest';

export const POST_WITHDRAW = '/api/tokenWithdrow/withdraw';
// const GET_WITHDRAW_DETAIL = '/api/tokenWithdrow/detail'
const FETCH_INGAME_BALANCE = '/api/tokenDeposit/game/queryIntegral';
const GET_WITHDRAW_CONFIGS = '/api/depositWithdrowConfig/page';
const GET_DEPOSIT_LOGS = '/api/tokenLog/page';
export const GET_DEPOSIT_WITHDRAW_HISTORY = '/api/tokenDeposit/depositWithdrawPage';

// export type WithdrawDetail = {
//     createdTime: string
//     delFlag: number
//     feeAmount: number
//     finished: number
//     freeze: string
//     id: number
//     modifyTime: string
//     optTime: string
//     optType: number
//     refundState: number
//     refundTime: string
//     sourceId: string
//     syned: number
//     tokenAddress: string
//     tokenAmount: number
//     tokenFrom: string
//     tokenTo: string
//     transAmount: number
//     transHash: string
//     transferTime: string
//     version: number
//     withdrowId: string
// }
// export const useWithdrawDetail = ({params, key}: {params: {withdrowId: number}; key: number}, queryConfig = {}) => {
//     return useMarketApiRequest<WithdrawDetail>(
//         [GET_WITHDRAW_DETAIL, key],
//         {url: GET_WITHDRAW_DETAIL, params, method: 'get'},
//         {...queryConfig, initialData: []}
//     )
// }

type PageData<Content> = {
  content: Content[];
  pageNumber: number;
  pageSize: number;
  total: number;
};

type IngameBalanceParams = { integralName?: string; userId?: string };
type IngameBalance = {
  integralAmount: number;
  integralName: string;
};
export const useIngameBalance = (
  { params, key }: { params: IngameBalanceParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<PageData<IngameBalance>>(
    [FETCH_INGAME_BALANCE, key],
    { url: FETCH_INGAME_BALANCE, params, method: 'post' },
    { initialData: [], ...queryConfig },
  );
};

type WithdrawConfigsParams = { tokenAddress?: string };
type WithdrawConfigs = Record<string, string>;
export const useWithdrawConfigs = (
  { params, key }: { params: WithdrawConfigsParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<PageData<WithdrawConfigs>>(
    [GET_WITHDRAW_CONFIGS, key],
    { url: GET_WITHDRAW_CONFIGS, params, method: 'get' },
    { initialData: [], ...queryConfig },
  );
};

type DepositHistoryParams = {
  type?: 'withdraw' | 'deposit' | 'all';
  symbol?: string;
  amount?: string;
  feeAmount?: string;
  finished?: 0 | 1 | 2;
};
type DepositHistory = {
  amount: string;
  feeAmount: number;
  finished: number;
  symbol: string;
  transHash: string;
  transId: string;
  transferTime: string;
  type: string;
};
export const useDepositHistory = (
  { params, key }: { params: DepositHistoryParams; key: any },
  queryConfig = {},
) => {
  if (params.symbol === 'all') {
    delete params.symbol;
  }
  return useMarketApiRequest<PageData<DepositHistory>>(
    [GET_DEPOSIT_WITHDRAW_HISTORY, key],
    {
      url: GET_DEPOSIT_WITHDRAW_HISTORY,
      params: {
        ...params,
        'orderBys[0].property': 'transferTime',
        'orderBys[0].direction': 'DESC',
      },
      method: 'get',
    },
    { initialData: [], ...queryConfig },
  );
};
