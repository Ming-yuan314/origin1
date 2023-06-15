import { formatAddress } from '@/web3/format';
import { AuthStatusMap, useActiveWeb3React } from '@/web3/WalletProvider';
import styled from '@emotion/styled';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export enum ConnectButtonPositionType {
  HEADER = 'header',
  BET = 'bet',
}

const CustomConnectButton: React.FC<{
  type: ConnectButtonPositionType;
  showWalletInfo?: boolean;
}> = ({ type, showWalletInfo }) => {
  const { authenticatStatus, isAuthenticated } = useActiveWeb3React();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        // openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <StyledConnectButton className={type} onClick={openConnectModal}>
                    Connect Wallet
                  </StyledConnectButton>
                );
              }
              if (chain?.unsupported) {
                return (
                  <StyledConnectButton className={type} onClick={openChainModal}>
                    Wrong network
                  </StyledConnectButton>
                );
              }
              if (authenticatStatus === AuthStatusMap.Authenticating) {
                return (
                  <StyledConnectButton className={type} onClick={openChainModal}>
                    Authenticating
                  </StyledConnectButton>
                );
              }
              if (isAuthenticated && showWalletInfo) {
                return (
                  <HeaderWalletInfo>
                    <div className="inner">
                      <div className="cjc-value">
                        {formatAddress(account?.address)} - 吴泽昊
                      </div>
                    </div>
                  </HeaderWalletInfo>
                );
              }
              return <StyledConnectButton className={type}></StyledConnectButton>;
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;

const StyledConnectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.9;
  &:hover {
    opacity: 1;
  }

  &.header {
    background: #117947;
    border-radius: 32px;
    width: 160px;
    height: 44px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: #dedede;
  }

  &.bet {
    background: linear-gradient(180deg, #32b475 0%, #117b48 100%);
    border-radius: 4px;
    width: 128px;
    height: 32px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    color: #ffffff;
  }
`;

const HeaderWalletInfo = styled.div`
  min-width: 200px;
  height: 44px;
  background: #262626;
  border-radius: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #4a4a4a 0%, #1d1d1d 100%);

  > .inner {
    min-width: 198px;
    height: 42px;
    background: #262626;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    padding-right: 16px;
    border-radius: 42px;

    > img {
      width: 28px !important;
      height: 28px !important;
    }

    .cjc-value {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 100%;
      color: #dedede;
    }
  }
`;
