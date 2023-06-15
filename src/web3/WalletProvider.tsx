import { getLoginNonce, UserData, USER_LOGIN_API } from '@/hooks/queries/useAuthApis';
import useAlert from '@/hooks/useAlert';
import { usePost } from '@/hooks/useRequest';
import { selectUserInfo, updateUserInfo } from '@/store/user';
import { storage } from '@/utils/storage';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useWalletClient,
} from 'wagmi';

import {
  selectDesiredChainId,
  selectWalletConnectStatus,
  selectWalletType,
  updateDesiredChainId,
  updateWalletStatus,
  updateWalletType,
  // updateAccountModalVisible,
  // updateWalletType,
} from '../store/globalConfig';
// import {getTargetConnector, ConnectorTypes} from 'web3/wallet/connectors'

export enum AuthStatusMap {
  Unauthenticated = 'unauthenticated',
  Authenticating = 'authenticating',
  Authenticated = 'authenticated',
}

const Web3WalletProvider = createContext<
  | {
      account: `0x${string}` | undefined;
      web3Provider: any;
      currentChainId: number;
      isActive: boolean;
      isActivating: boolean;
      // connector: any
      error: Error | null;
      ethWalletChainId: number | unknown;
      chainCorrect: boolean;
      walletType: string | null | unknown;
      isAuthenticated: boolean;
      authenticatStatus: AuthStatusMap;
      // getTargetConnector: (walletType: string) => any
    }
  | undefined
>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const authenticatingRef = useRef(false);
  /* redux store states */
  // current wallet type for connection
  const walletType = useSelector(selectWalletType);
  // const userInfo = useSelector(selectUserInfo);
  // a state to provide the wallet is correctly connected
  // correctly connected means not only your wallet is linked to the dapp website
  // but also need the chain ID of your wallet is correctly match to the dapp desired chain ID
  const walletConnected = useSelector(selectWalletConnectStatus);
  // desired chain ID is related to your send chain type
  const desiredChainId = useSelector(selectDesiredChainId);
  const { setAlert } = useAlert();
  const [signResult, setSignResult] = useState('');
  const signPendingRef = useRef(false);
  const registPendingRef = useRef(false);
  const [loading, setLoading] = useState('');
  const { disconnect } = useDisconnect();
  const [chainCorrect, setChainCorrect] = useState(true);

  /* Web3-React states */
  // while walletType is null, getTargetConnector will return a bunch of empty or null hooks
  // const [connector, {useAccount, useProvider, useChainId, useIsActive, useIsActivating, useError, useAccounts}] =
  //     getTargetConnector(walletType)
  const {
    address: account,
    isConnected: isActive,
    isConnecting: isActivating,
  } = useAccount();
  const { connect, error } = useConnect();
  // const accounts = useAccounts()
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const chainId = chain?.id || -1;
  // const isActive = useIsActive()
  // const isActivating = useIsActivating()
  // const error = useError()

  /* Provider states */
  // a flag shows wallet is linked to the dapp
  const connected = Boolean(chain?.id && account);
  // chain ID of the linked wallet is connected
  const [ethWalletChainId, setEthWalletChainId] = useState<number>(-1);

  const [authenticatStatus, setAuthenticatStatus] = useState<AuthStatusMap>(
    chainCorrect && isActive
      ? AuthStatusMap.Authenticated
      : AuthStatusMap.Unauthenticated,
  );
  // if desiredChainId is not match the chainId or ethWalletChainId, make chainCorrect false,
  // then automatic active the wallet by desiredChainId
  // for Metamask, wallet will call the active or chainSwitch interface
  // for WalletConnect, a qr code modal will show
  useEffect(() => {
    if (!desiredChainId) {
      return;
    }
    if (desiredChainId !== chainId) {
      setChainCorrect(false);
      // connector.activate(getAddChainParameters(desiredChainId) as number)
    } else {
      setChainCorrect(true);
    }
  }, [desiredChainId, chainId, walletType]);

  useEffect(() => {
    return () => {
      dispatch(updateWalletStatus(false));
    };
  }, []);

  // useEffect(() => {
  //     if (web3Provider) {
  //         web3Provider.provider.on('chainChanged', async () => {
  //             const _chainId = await web3Provider.provider.request({method: 'eth_chainId'})
  //             if (CHAINS?.[Number(_chainId)]) {
  //                 dispatch(updateDesiredChainId(Number(_chainId)))
  //                 Lockr.set('lastDesiredChainId', Number(_chainId))
  //                 return
  //             }
  //         })
  //     }
  // }, [web3Provider])

  // update wallet status in redux store
  useEffect(() => {
    if (connected && desiredChainId === chainId && !walletConnected) {
      dispatch(updateWalletStatus(true));
    } else {
      dispatch(updateWalletStatus(false));
    }
  }, [connected, dispatch, desiredChainId, chainId, walletType]);

  // when provider is a web3 provider, detect chain ID by rpc method and store it
  useEffect(() => {
    if (walletClient) {
      walletClient.request({ method: 'eth_chainId' }).then((res) => {
        setEthWalletChainId(Number(res));
      });
    }
  }, [walletType, chainId]);

  useEffect(() => {
    if (error?.message.includes('User closed modal')) {
      setLoading('');
    }
  }, [error]);

  const clearConnectAction = () => {
    disconnect();
    dispatch(updateWalletStatus(false));
    dispatch(updateWalletType(null));
    dispatch(updateUserInfo(null));
    setSignResult('');
    setAuthenticatStatus(AuthStatusMap.Unauthenticated);
    Lockr.rm('ethConnectType');
  };

  useEffect(() => {
    if (signPendingRef.current || !walletClient) {
      return;
    }
    if (isActive && walletClient && !signPendingRef.current) {
      (async () => {
        signPendingRef.current = true;
        setAuthenticatStatus(AuthStatusMap.Authenticating);
        // const nonceData = await getLoginNonce({ params: { address: account as string } });
        // if (!nonceData.data) {
        //   setAlert({ message: 'Get nonce failed', type: 'error' });
        // }
        const msgParams = [`验证登录人: 吴哲昊`, account];
        walletClient
          // @ts-ignore
          .request({ method: 'personal_sign', params: msgParams })
          .then((res: string) => {
            if (res) {
              setSignResult(res);
              setAuthenticatStatus(AuthStatusMap.Authenticated);
            }
          })
          .catch((err: Error) => {
            setLoading('');
            // const [connector] = getTargetConnector(ethWalletType);
            clearConnectAction();
            setAlert({ message: err.message || 'Sign Failed', type: 'error' });
          })
          .finally(() => {
            signPendingRef.current = false;
          });
      })();
      // setNonceKey(0)
    }
  }, [isActive, walletClient]);

  // const saveLoginInfo = (data: { expiration: number; user: UserData; token: string }) => {
  //   const { expiration, user, token } = data;
  //   const expireTime = dayjs().add(expiration, 'milliseconds').format();
  //   const loginInfo = {
  //     expireTime,
  //     user,
  //     token,
  //   };
  //   const savedInfo: any = storage.getLocalStorageObject('userTokenMap', null);
  //   if (savedInfo?.[account as string]) {
  //     delete savedInfo[account as string];
  //   }
  //   savedInfo[account as string] = loginInfo;
  //   localStorage.setItem('userTokenMap', JSON.stringify(savedInfo));
  // };

  // useEffect(() => {
  //   if (registPendingRef.current) {
  //     return;
  //   }
  //   if (signResult) {
  //     registPendingRef.current = true;
  //     usePost({
  //       url: USER_LOGIN_API,
  //       method: 'post',
  //       data: `address=${account}&signature=${signResult}`,
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //       },
  //     })
  //       .then((res) => {
  //         console.log(res, 'check res');
  //         if (res.data.code === '1' && res.data?.data?.user?.id) {
  //           dispatch(updateUserInfo(res.data.data.user));
  //           saveLoginInfo(res.data.data);
  //           setAlert({ message: 'Login Success', type: 'success' });
  //           setAuthenticatStatus(AuthStatusMap.Authenticated);
  //         } else {
  //           clearConnectAction();
  //           setAlert({ message: 'Login Failed', type: 'error' });
  //         }
  //       })
  //       .catch((err) => {
  //         clearConnectAction();
  //         setAlert({ message: 'Login Failed', type: 'error' });
  //       })
  //       .finally(() => {
  //         registPendingRef.current = false;
  //         setLoading('');
  //       });
  //   }
  // }, [signResult]);

  return (
    <Web3WalletProvider.Provider
      value={{
        account: chainCorrect ? account : undefined,
        web3Provider: walletClient && new Web3Provider(walletClient as ExternalProvider),
        currentChainId: chainId,
        isActive: chainCorrect && isActive,
        // connector: connector,
        error: error,
        isActivating,
        ethWalletChainId: ethWalletChainId,
        chainCorrect: chainCorrect,
        walletType,
        isAuthenticated: chainCorrect && isActive,
        authenticatStatus,
        // getTargetConnector: getTargetConnector
      }}
    >
      {children}
    </Web3WalletProvider.Provider>
  );
};

export const useActiveWeb3React = () => {
  const context = useContext(Web3WalletProvider);

  if (!context) {
    throw new Error('useActiveWeb3React must be used in Web3WalletProvider');
  } else {
    return context;
  }
};
