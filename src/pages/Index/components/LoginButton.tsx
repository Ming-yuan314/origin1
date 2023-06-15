import styled from '@emotion/styled';
import { Web3Provider } from '@ethersproject/providers';
// import { loadingCircles } from 'components/common/Button';
// import ButtonLoading from 'components/enhanced/Loading/ButtonLoading';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import qs from 'query-string';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletType } from 'web3/wallet/connectors';
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import xss from 'xss';

// import {useActiveWeb3React} from '@/web3/WalletProvider'
// import { getAddChainParameters } from 'web3/wallet/chains';
import {
  getLoginNonce,
  SAVE_INVITE_CODE,
  useLoginNonce,
  USER_LOGIN_API,
  UserData,
} from '@/hooks/queries/useAuthApis';
import useAlert from '@/hooks/useAlert';
import { usePost } from '@/hooks/useRequest';

import MetamaskPng from '../../static/img/metamask.png';
import WalletConnectPng from '../../static/img/walletconnect_icon.png';
import {
  selectDesiredChainId,
  selectWalletType,
  updateLastEthConnectType,
  updateWalletStatus,
  updateWalletType,
} from '@/store/globalConfig';
import { selectUserInfo, updateUserInfo } from '@/store/user';
import { storage } from '@/utils/storage';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const getBackUrl = () => {
  let backUrl = decodeURIComponent(window.location.href.split('backUrl=')[1] || '');
  backUrl = backUrl.toLowerCase().replace(/javascript/g, '');
  return xss(backUrl);
};

const LoginButton: React.FC = () => {
  const dispatch = useDispatch();
  const { connector, address: account, isConnected: isActive } = useAccount();
  const { connect, error } = useConnect();
  const web3Provider = usePublicClient();
  const signer = useWalletClient();
  const { setAlert } = useAlert();
  const desiredChainId = useSelector(selectDesiredChainId);
  const navigate = useNavigate();
  const location = useLocation();
  const ethWalletType = useSelector(selectWalletType);
  const [connecting, setConnecting] = useState(false);
  const [nonceKey, setNonceKey] = useState(0);
  const [signResult, setSignResult] = useState('');
  const signPendingRef = useRef(false);
  const registPendingRef = useRef(false);
  const [loading, setLoading] = useState('');
  const { disconnect } = useDisconnect();
  // const userInfo = useSelector(selectUserInfo);

  const { ref: refCode, type } = qs.parse(location.search);

  const handleSaveInviteCode = (cb: () => void) => {
    if (!refCode || !(+(type || 0) === 1 || +(type || 0) === 0)) {
      setAlert({ message: 'Invalid referrerCode', type: 'error' });
      cb?.();
      return;
    }
    usePost({
      url: SAVE_INVITE_CODE,
      method: 'post',
      data: `address=${account}&referrerCode=${refCode}&type=${type}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res) => {
        if (res.data.code !== '1') {
          setAlert({ message: 'Save invite code failed', type: 'error' });
        }
      })
      .catch((err) => {
        setAlert({ message: 'Save invite code failed', type: 'error' });
      })
      .finally(() => {
        cb?.();
      });
    return;
  };

  useEffect(() => {
    if (ethWalletType) {
      // const [connector] = getTargetConnector(ethWalletType);
      clearConnectAction();
    }
  }, []);

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
    setNonceKey(-1);
    setSignResult('');
    Lockr.rm('ethConnectType');
  };

  // const handleConnect = async (walletType: any) => {
  //   if (loading) {
  //     return;
  //   }
  //   setLoading(walletType);
  //   // setNonceKey(nonceData.data)
  //   dispatch(updateWalletType(walletType));
  //   Lockr.set('ethConnectType', walletType);
  //   dispatch(updateLastEthConnectType(walletType));
  //   setConnecting(true);
  //   // const [connector] = getTargetConnector(walletType);
  //   try {
  //     connect();
  //   } catch (e) {
  //     clearConnectAction();
  //     console.log(error, e, 'check error');
  //   }
  // };

  // useEffect(() => {
  //   if (signPendingRef.current || !web3Provider) {
  //     return;
  //   }
  //   if (isActive) {
  //     (async () => {
  //       const nonceData = await getLoginNonce({ params: { address: account as string } });
  //       if (!nonceData.data) {
  //         setAlert({ message: 'Get nonce failed', type: 'error' });
  //       }
  //       signPendingRef.current = true;
  //       const msgParams = [nonceData.data, account];
  //       web3Provider
  //         // @ts-ignore
  //         .request({ method: 'personal_sign', params: msgParams })
  //         .then((res) => {
  //           if (res) {
  //             setSignResult(res);
  //           }
  //         })
  //         .catch((err) => {
  //           setLoading('');
  //           // const [connector] = getTargetConnector(ethWalletType);
  //           clearConnectAction();
  //           setAlert({ message: err.message || 'Sign Failed', type: 'error' });
  //         })
  //         .finally(() => {
  //           signPendingRef.current = false;
  //         });
  //     })();
  //     // setNonceKey(0)
  //   }
  // }, [isActive]);

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
  //         if (res.data.code === '1' && res.data?.data?.user?.id) {
  //           dispatch(updateUserInfo(res.data.data.user));
  //           saveLoginInfo(res.data.data);
  //           setAlert({ message: 'Login Success', type: 'success' });
  //         } else {
  //           console.log(res, 'here')
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

  // useEffect(() => {
  //     if (ethWalletType && connecting && !isActive) {
  //         connector.activate(
  //             desiredChainId ? (getAddChainParameters(desiredChainId) as number) : (undefined as number)
  //         )
  //     }
  // }, [connecting, nonceKey, ethWalletType])

  useEffect(() => {
    const backUrl = getBackUrl();
    if (isActive) {
      setConnecting(false);
      handleSaveInviteCode(() => {
        navigate(backUrl || '/');
      });
    }
  }, [isActive,]);

  return (
    <LoginWrapper>
      <ConnectButton></ConnectButton>
    </LoginWrapper>
  );
};

export default LoginButton;

const LoginWrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
