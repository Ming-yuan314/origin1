import { memo, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import 'twin.macro';
import { Link, useLocation } from 'react-router-dom';
import { useActiveWeb3React } from '@/web3/WalletProvider';
// import SidebarSetting from 'components/enhanced/SidebarSetting'
// import HeaderWalletStatus from 'components/enhanced/HeaderWalletStatus'

// import {ReactComponent as HomeSvg} from 'static/img/sidemenu_home.svg'
// import {ReactComponent as MarketSvg} from 'static/img/sidemenu_market.svg'
// import {ReactComponent as DashboardSvg} from 'static/img/sidemenu_dashboard.svg'
// import {ReactComponent as SidebarToggleSvg} from 'static/img/sidebar_toggle.svg'
// import {ReactComponent as MenuSVg} from 'static/img/sidebar_menu.svg'
import { ReactComponent as WalletSvg } from '@/static/img/luckywins/main_logo.svg';
import { ReactComponent as LuckyWinsSvg } from '@/static/img/luckywins/luckywins.svg';
import { ReactComponent as BetHistorySvg } from '@/static/img/luckywins/bet_history.svg';
import { ReactComponent as RaceHistorySvg } from '@/static/img/luckywins/race_history.svg';
import { ReactComponent as JackpotSvg } from '@/static/img/luckywins/jackpot.svg';
import { ReactComponent as MenuBalanceSvg } from '@/static/img/luckywins/menu_balance.svg';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import LoginButton, { ConnectButtonPositionType } from '../enhanced/ConnectButton';

export type PageType = 'user' | 'home' | 'history';
const MenuItems = [
  {
    key: 'home',
    name: '信息录入',
    path: '/',
  },
  {
    key: 'history',
    name: '历史数据',
    path: '/history',
  },
  // {
  //   key: 'user',
  //   name: '个人信息',
  //   path: '/user',
  // },
];

const Header = memo(() => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [curPath, setCurPath] = useState<PageType>('home');
  const { isActive } = useActiveWeb3React();

  useEffect(() => {
    const { pathname } = location;
    if (pathname.includes('home') || pathname === '/') {
      setCurPath('home');
    } else if (pathname.includes('history')) {
      setCurPath('history');
    } else if (pathname.includes('user')) {
      setCurPath('user');
    }
  }, [location]);

  return (
    <HeaderWrapper height={114}>
      <ContentWrapper>
        <MenuList>
          {MenuItems.map((item) => (
            <Link to={item.path} key={item.key}>
              <SingleMenu isActive={curPath === item.key}>{item.name}</SingleMenu>
            </Link>
          ))}
        </MenuList>
      </ContentWrapper>

      <ContentWrapper tw="justify-end pb-2.5">
        <LoginButton type={ConnectButtonPositionType.HEADER} showWalletInfo={true} />
      </ContentWrapper>
    </HeaderWrapper>
  );
});

export default Header;

const HeaderWrapper = styled.div<{ height: number }>`
  height: ${(props) => props.height}px;
  width: 100%;
  min-width: 1600px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #232631 0%, #181a25 100%);
  border-right: 1px solid #1e2127;
  z-index: 4;
  padding: 0 40px;
  position: sticky;
  top: 0;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  transition: all 0.5s;

  .logo {
    font-style: normal;
    font-weight: 400;
    font-size: 38px;
    line-height: 45px;
    color: #000;
    margin-bottom: 40px;
  }
  .divide-line {
    margin: 24px auto;
    height: 1px;
    background: #868b90;
    opacity: 0.2;
    width: 100%;
    flex-shrink: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .logo-wrap {
    width: 138px;
    height: 48px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 6px;
    margin-right: 32px;
  }

  &.wallet {
    padding-top: 20px;
    padding-bottom: 0;
  }
`;

const MenuList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;

  > a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 48px;
    color: #bebcbd;

    > svg {
      margin-right: 4px;
    }
  }
`;

const SingleMenu = styled.div<{ isActive?: boolean }>`
  width: 140px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isActive ? '#1F1D1E' : '#bebcbd')};
  background: ${(props) => (props.isActive ? '#e1e1e1' : 'none')};
  border-radius: 8px 8px 0px 0px;

  position: relative;
  cursor: pointer;

  > svg {
    > path {
      fill: ${(props) => (props.isActive ? '#1F1D1E' : '#bebcbd')};
    }
  }

  &:hover {
    color: ${(props) => (props.isActive ? '#1F1D1E' : '#1F1D1E')};
    background: #b8b8b8;
    > svg > path {
      fill: ${(props) => (props.isActive ? '#1F1D1E' : '#1F1D1E')};
    }
    &.wallet {
      svg {
        path {
          fill: ${(props) => (props.isActive ? '#1F1D1E' : '#bebcbd')};
        }
      }
    }
  }
`;

const WalletWrapper = styled.div`
  height: 64px;
  width: 100%;
  /* padding: 0 12px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 100%;
  color: #868b90;
  cursor: pointer;
  background: #303440;
  border: 1px solid #3a3e46;
  border-radius: 8px;
  overflow: hidden;

  .tooltip-title {
    width: 100%;
  }

  &:hover {
    color: #fff;
    > svg > path {
      fill: #fff;
    }
  }
`;
const SidebarSettingWrap = styled.div`
  width: 48px;
  height: 100%;
`;

const SidebarToggle = styled.div<{ isHide: boolean }>`
  width: 24px;
  height: 64px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: #424955;
  border-radius: 8px 0px 0px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.8;
  > svg {
    transition: all 0.5s;
    transform: ${(props) => (props.isHide ? 'rotateY(180deg)' : 'rotateY(0deg)')};
  }

  &:hover {
    opacity: 1;
  }
`;

const SidebarMenu = styled.div`
  width: 48px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #383d4d;
`;
