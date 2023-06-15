import axios from 'axios';
import qs from 'query-string';

import { envPrefix, useMarketApiRequest } from '../useRequest';
import { GetRequest } from './../useRequest';

const GET_LOGIN_NONCE = '/api/lucky/user/getLoginNonce';
const GET_USER_INFO_API = '/api/wallet/user/detail';
export const USER_LOGIN_API = '/api/lucky/user/login';
export const SAVE_INVITE_CODE = '/api/marketing/account/referrerSave';
export const SEND_CODE_API = '/api/wallet/email/sendEmail';
export const BIND_EMAIL_API = '/api/wallet/email/bindEmail';
export const SAVE_NAME_API = '/api/wallet/user/updateNickname';
export const CHANGE_PASSWORD_API = '/api/wallet/user/updatePassword';
export const RESET_PASSWORD_API = '/api/wallet/user/resetPassword';

export enum SendCodeTypes {
  BIND_EMAIL = 0,
  CHANGE_EMAIL = 1,
  RESET_EMAIL = 2,
}

type LoginNonceParams = { address: string };
type LoginNonceResult = {
  data: string;
};
export const useLoginNonce = (
  { params, key }: { params: LoginNonceParams; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<LoginNonceResult>(
    [GET_LOGIN_NONCE, key],
    { url: GET_LOGIN_NONCE, params, method: 'get' },
    { initialData: null, ...queryConfig },
  );
};

export const getLoginNonce = async ({ params }: { params: LoginNonceParams }) => {
  const realRequest: GetRequest = {
    url: `${envPrefix}${GET_LOGIN_NONCE}?${qs.stringify(params)}`,
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const result = await axios(realRequest!);
  if (result.status === 200 && result.data.code === '1' && result.data.data) {
    return result.data.data;
  } else {
    return null;
  }
};

export type UserData = {
  address: string;
  createdTime: string;
  delFlag: number;
  email: string;
  hash: string;
  id: number;
  jwtToken: string;
  modifyTime: string;
  new: true;
  orders: number;
  password: string;
  sign: string;
  version: number;
};

export const useUserInfo = (
  { params, key }: { params: { id: number }; key: any },
  queryConfig = {},
) => {
  return useMarketApiRequest<UserData>(
    [GET_USER_INFO_API, key],
    { url: GET_USER_INFO_API, params, method: 'get' },
    { initialData: null, ...queryConfig },
  );
};
