import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import Lockr from 'lockr';
import _isEqual from 'lodash/isEqual';
import { memo, useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';

import { UserData, useUserInfo } from '@/hooks/queries/useAuthApis';
import useAlert from '@/hooks/useAlert';

// import SideBar from 'components/common/SideBar';
import {
  selectPendingEndResult,
  selectScrollTopTrigger,
  updateWalletStatus,
  updateWalletType,
} from '@/store/globalConfig';
// import AccountDrawer from 'components/enhanced/AccountDrawer/AccountDrawer';
// import Pooling from 'components/enhanced/BlockNumberPoolling';
// import { useActiveWeb3React } from '@/web3/WalletProvider';
import { selectUserInfo, updateUserInfo } from '@/store/user';
import { isSameAddress } from '@/utils/format';
import { storage } from '@/utils/storage';
import Header from '@/components/common/Header';
import BgImg from '@/static/img/luckywins/bg-img.png';

interface StoredUserInfo {
  expireTime: string;
  user: UserData;
  token: string;
}

type UserInfoMap = Record<string, StoredUserInfo>;

const Index = memo(() => {
  const { address: account } = useAccount();
  const { disconnect } = useDisconnect();
  const dispatch = useDispatch();
  const { setAlert } = useAlert();

  // const userInfo = useSelector(selectUserInfo);
  const checkExistedToken = (address: string) => {
    const userTokenMap: any = storage.getLocalStorageObject('userTokenMap', null);
    const userData = userTokenMap?.[address];
    if (userData && !dayjs().isAfter(dayjs(userData.expireTime))) {
      return userData.user;
    }
    return false;
  };

  // useEffect(() => {
  //   if (!userInfo?.address || !account) {
  //     return;
  //   }
  //   if (!isSameAddress(account, userInfo.address)) {
  //     const existedUser = checkExistedToken(account);

  //     if (existedUser) {
  //       dispatch(updateUserInfo(existedUser));
  //       setAlert({ type: 'notice', message: 'Switching Account...' });
  //       setTimeout(() => {
  //         // alert('here')
  //         window.location.href = '/';
  //       }, 2000);
  //     } else {
  //       dispatch(updateWalletStatus(false));
  //       dispatch(updateWalletType(null));
  //       dispatch(updateUserInfo(null));
  //       Lockr.rm('ethConnectType');
  //       Lockr.rm('redux_localstorage_simple_user');
  //       disconnect();
  //       setTimeout(() => {
  //         // alert('here 2')
  //         window.location.href = '/';
  //       }, 500);
  //     }
  //   }
  // }, [account]);

  const scrollRef = useRef<any>(null);
  const scrollToTopTrigger = useSelector(selectScrollTopTrigger);

  useEffect(() => {
    if (scrollRef.current?.view) {
      scrollRef.current.view.scroll({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [scrollToTopTrigger]);

  return (
    <IndexWrapper>
      <ContentWrapper
        ref={scrollRef}
        renderThumbHorizontal={({ style, ...props }: { style: any }) => (
          <div
            {...props}
            style={{
              ...style,
              backgroundColor: '#43464b',
              borderRadius: '6px',
              cursor: 'pointer',
              zIndex: 2,
            }}
          />
        )}
        style={{ width: '101%' }}
      >
        <Header />

        <Content>
          <Outlet />
        </Content>
      </ContentWrapper>
    </IndexWrapper>
  );
});

Index.displayName = 'IndexPageWrapper';

export default Index;

const IndexWrapper = styled.div`
  height: 100vh;
  /* min-width: 1264px; */
  width: 100%;
  /* min-width: 1200px; */
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 0.5s;
  background: #e1e1e1;
  /* background: linear-gradient(
        270deg,
        rgba(35, 41, 43, 1) 0%,
        rgba(39, 44, 46, 1) 26.56%,
        rgba(29, 27, 24, 1) 78.13%,
        rgba(22, 25, 27, 1) 100%
    ); */
  .background-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1600px;
    z-index: 0 !important;
    min-height: calc(100vh - 114px);
    /* animation: ${() => pendingArrows()} 5s infinite linear; */
  }
`;

const ContentWrapper = styled(Scrollbars)`
  position: relative;
  width: 100%;
  min-height: 100vh;
  z-index: 1;
  padding-top: 114px;
`;
const Content = styled.div`
  min-height: 100vh;
  min-width: 1600px;
  position: relative;
  > * {
    z-index: 2;
  }
`;

const pendingArrows = () => keyframes`
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
`;
