import styled from '@emotion/styled';
import ClaimBg from '@/static/img/luckywins/claim_bg.png';
import TreasureBox from '@/static/img/luckywins/treasure_box.png';
import ClaimButtonBg from '@/static/img/luckywins/claim_button.png';
import { ReactComponent as ClaimSvg } from '@/static/img/luckywins/claim_svg.svg';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import { useGetBalance } from '@/hooks/queries/useLuckywinsApis';
import clsx from 'clsx';
import { useLuckywinsContract } from '@/hooks/queries/useLucywinsContract';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPendingEndResult, updatePendingEndResult } from '@/store/globalConfig';
import useAlert from '@/hooks/useAlert';

const ClaimPage: React.FC = () => {
  const dispatch = useDispatch();
  const { setAlert } = useAlert();
  const pendingKey = useSelector(selectPendingEndResult);
  const [claimLoading, setClaimLoading] = useState(false);
  const { account, isAuthenticated } = useActiveWeb3React();
  const { data: cjcBalance } = useGetBalance(
    { params: { owner: account }, key: pendingKey },
    {
      enabled: isAuthenticated,
      initialData: { totalCjc: 0 },
    },
  );

  const { claimCjc } = useLuckywinsContract();

  const handleClaim = async () => {
    if (claimLoading || !cjcBalance?.content?.length) {
      return;
    }
    setClaimLoading(true);
    const ticketIds = cjcBalance.content.map((x) => x.ticketId);
    const txResult = await claimCjc(ticketIds);

    if (!txResult?.wait) {
      setAlert({ type: 'error', message: 'Claim Errored!' });
      alert('Tx Errored');
      return;
    }
    await txResult.wait();
    setAlert({ type: 'success', message: 'Claim Succeed!' });
    dispatch(updatePendingEndResult(Math.random()));
  };

  return (
    <ClaimPageWrapper>
      <ClaimContent>
        <div className="header-line">
          <ClaimSvg />
          Unclaimed Balance
        </div>
        <div className="claim-content">
          <div className="treasure-img">
            <img src={TreasureBox} className="treasure-box" alt="" />
          </div>
          <div className="cjc-value">{cjcBalance?.totalCjc} CJC</div>
          <div className="cjc-label">≈ 32.28 USDT</div>

          <ClaimButton
            onClick={handleClaim}
            className={clsx(!cjcBalance?.totalCjc && 'disabled')}
          >
            <span>{claimLoading ? 'Claiming' : 'Claim all'}</span>
            <img src={ClaimButtonBg} className="claim-button" alt="" />
          </ClaimButton>
        </div>
        <img src={ClaimBg} className="claim-bg" alt="" />
      </ClaimContent>
    </ClaimPageWrapper>
  );
};

export default ClaimPage;

const ClaimPageWrapper = styled.div`
  width: 100%;
  height: auto;
`;

const ClaimContent = styled.div`
  width: 540px;
  height: 476px;
  position: relative;
  margin: 120px auto 0;
  z-index: 1;

  > .header-line {
    width: 100%;
    height: 48px;
    padding: 0 17px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #49463d;
    border-radius: 4px 4px 0px 0px;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;

    > svg {
      margin-right: 4px;
    }
  }

  .claim-content {
    width: 540px;
    height: 429px;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;

    > .treasure-img {
      width: 195px;
      height: 195px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3eada;
      margin-bottom: 22px;

      > img.treasure-box {
        width: 180px;
        height: 180px;
      }
    }

    .cjc-value {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 32px;
      line-height: 48px;
      background: linear-gradient(180deg, #a59484 0%, #342e32 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
    .cjc-label {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      color: #999999;
      margin-top: -4px;
      margin-bottom: 30px;
    }
  }

  > .claim-bg {
    width: 540px;
    height: 429px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

const ClaimButton = styled.div`
  width: 220px;
  height: 46px;
  background: #e5caa0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.9;
  position: relative;

  > span {
    z-index: 1;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: #464248;
    position: relative;
  }

  > img.claim-button {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
  &:hover {
    opacity: 1;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5 !important;
  }
`;
