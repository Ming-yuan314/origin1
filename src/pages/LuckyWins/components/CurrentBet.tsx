import React, { memo, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import 'twin.macro';
import { ReactComponent as BetSvg } from '@/static/img/luckywins/icon_bet.svg';
import { ReactComponent as BetEmptySvg } from '@/static/img/luckywins/bet_empty.svg';
import { ReactComponent as BetPositionSvg } from '@/static/img/luckywins/bet_position.svg';
import { ReactComponent as MinusSvg } from '@/static/img/luckywins/bet_minus.svg';
import { ReactComponent as PlusSvg } from '@/static/img/luckywins/bet_plus.svg';
import { ReactComponent as BetRemoveSvg } from '@/static/img/luckywins/bet_remove.svg';
import { ReactComponent as ConnectInfoSvg } from '@/static/img/luckywins/connect_info.svg';
import { useLuckywinsContract } from '@/hooks/queries/useLucywinsContract';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, updateElectricRecord } from '@/store/user';
import ConnectButton, {
  ConnectButtonPositionType,
} from '@/components/enhanced/ConnectButton';
import { BetProps } from '@/hooks/queries/useLuckywinsApis';
import clsx from 'clsx';
import ApprovalOperator from '@/components/enhanced/ApprovalOperator';
import { CjcTokenList } from '@/hooks/useCjcNftAddr';
import { LUCYWINS_CONTRACT } from '@/hooks/queries/useLucywinsContract';
import useAlert from '@/hooks/useAlert';
import { formatUnits } from 'viem';
import { parseUnits } from 'ethers/lib/utils';
import { useActiveWeb3React } from '@/web3/WalletProvider';

interface CurrentBetProps {
  currentBets: BetProps[];
}

const BetBlock = memo(
  ({
    handleBetSelected,
    handleBetRemove,
    betData,
  }: {
    betData: BetProps;
    handleBetSelected: (v: BetProposal) => void;
    handleBetRemove: (v: BetProposal) => void;
  }) => {
    // const [betAmount, setBetAmount] = useState(0);
    const handleBetAmountChange = (amount: number) => {
      // const newAmount = betAmount + amount < 0 ? 0 : betAmount + amount;
      // setBetAmount(amount);

      if (amount > 0) {
        const _betItem = {
          lotteryId: betData.raceId,
          playerNumber: betData.playerNumber,
          amount: amount,
          betPrice: betData.priceTicketInCjc,
        };
        handleBetSelected(_betItem);
      }
    };

    return (
      <BetBlockWrap>
        <div
          onClick={() =>
            handleBetRemove({
              lotteryId: betData.raceId,
              playerNumber: betData.playerNumber,
              amount: 0,
              betPrice: betData.priceTicketInCjc,
            })
          }
          className="remove-button"
        >
          <BetRemoveSvg />
        </div>

        <div className="bet-title">
          <BetPositionSvg />
          {betData.matchAddress}, {betData.matchCountry}
        </div>

        <div className="top">
          <div className="single-bet-info">
            <div className="label">Bet No.</div>
            <div className="value">{betData.id}</div>
          </div>
          <div className="single-bet-info">
            <div className="label">Horse</div>
            <div className="value">#{betData.horseId}</div>
          </div>
          <div className="single-bet-info">
            <div className="label">Jockey</div>
            <div className="value">#{betData.jockeyId}</div>
          </div>
        </div>
        <div className="bottom">
          <div className="label">Amount of CJC</div>
          <BetInputWrap>
            <input
              onChange={(e) => {
                if (+e.target.value < 0) {
                  return;
                }
                handleBetAmountChange(+e.target.value);
              }}
              type="number"
            />
          </BetInputWrap>

          {/* <BetAmountWrap>
            <div className="value">{betAmount}</div>
            <div className="label">Num of Bets</div>
          </BetAmountWrap> */}
        </div>
      </BetBlockWrap>
    );
  },
);

export interface BetProposal {
  lotteryId: number;
  playerNumber: number;
  amount: any;
  betPrice: number;
}

const CurrentBet: React.FC<CurrentBetProps> = () => {
  const dispatch = useDispatch();
  // const userInfo = useSelector(selectUserInfo);
  const { setAlert } = useAlert();
  const { account, isAuthenticated, web3Provider } = useActiveWeb3React();

  const [dateValue, setDateValue] = useState('');
  const [mainValue, setMainValue] = useState('');

  const confirmAvailable = useMemo(() => {
    return !!(dateValue && mainValue);
  }, [dateValue, mainValue]);

  const clearInputs = () => {
    setDateValue('');
    setMainValue('');
  };

  const handleConfirm = () => {
    if (!dateValue || !mainValue) return;

    const msg = `签署数据: ${dateValue} 用电 ${mainValue} 度`;

    const msgParams = [msg, account];
    web3Provider.provider
      .request({ method: 'personal_sign', params: msgParams })
      .then((res: string) => {
        console.log(res, 'check res');
        if (res) {
          setAlert({ message: '签署成功, 记录信息', type: 'success' });
          const data = {
            date: dateValue,
            value: mainValue,
            sign: res,
            recorder: account,
          };

          dispatch(updateElectricRecord(data));
          clearInputs();
        }
      })
      .catch((err: Error) => {
        console.log(err, ';check err');
        // const [connector] = getTargetConnector(ethWalletType);
        setAlert({ message: '签署失败, 请重新尝试', type: 'error' });
      });
  };

  return (
    <CurrentBetWrapper>
      <div className="bet-title">
        <BetSvg />
        录入用电数据
      </div>

      {!isAuthenticated ? (
        <ConnectInfoWrap>
          <ConnectInfoSvg />
          <span>请先链接钱包</span>
          <ConnectButton type={ConnectButtonPositionType.BET} />
        </ConnectInfoWrap>
      ) : (
        <>
          <BetListWrap>
            <div tw="mb-[5px]" className="label">
              请选择要输入的日期:
            </div>
            <BetInputWrap>
              <input
                value={dateValue}
                onChange={(e) => {
                  setDateValue(e.target.value);
                }}
                type="date"
              />
            </BetInputWrap>
            <div tw="mt-[10px] mb-[5px]" className="label">
              请输入电量数据:
            </div>
            <BetInputWrap>
              <input
                value={mainValue}
                onChange={(e) => {
                  setMainValue(e.target.value);
                }}
                type="number"
              />
            </BetInputWrap>
          </BetListWrap>
          <BetOperationWrap>
            <div className="intro-line">您输入的数据为: </div>
            <div className="cjc-line">
              {dateValue || '----/--/--'} 用电 {mainValue || '-'} 度
            </div>

            {!confirmAvailable ? (
              <ConfirmBetButton className={clsx('isDisabled')}>确定记录</ConfirmBetButton>
            ) : (
              <ConfirmBetButton onClick={handleConfirm}>确定记录</ConfirmBetButton>
            )}
          </BetOperationWrap>
        </>
      )}
    </CurrentBetWrapper>
  );
};

export default CurrentBet;

const CurrentBetWrapper = styled.div`
  width: 720px;
  min-height: 275px;
  background: #f4f4f4;
  border: 1px solid #c2c2c2;
  border-radius: 4px;

  > .bet-title {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #ffffff;
    padding: 0 16px;
    background: #49463d;

    > svg {
      margin-right: 8px;
    }
  }
`;

const BetListWrap = styled.div`
  padding: 16px 22px;
  position: relative;
  overflow-y: auto;

  .empty-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    opacity: 0.2;
    padding: 77px 0;

    > span {
      font-weight: 400;
      font-size: 12px;
      line-height: 18px;
      color: #000000;
      text-align: center;
      margin-top: 4px;
    }
  }
`;

const BetOperationWrap = styled.div`
  min-height: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;
  border-top: 1px dashed #a7a7a7;
  padding: 16px 22px;

  .intro-line {
    width: 100%;
    text-align: left;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #747474;
    opacity: 0.8;
    text-shadow: 0px 1px 0px #ffffff;
  }

  .cjc-line {
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
    color: #111111;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    text-align: left;
    width: 100%;

    > span {
      font-weight: 500;
      font-size: 12px;
      line-height: 18px;
      color: #2ca96d;
      margin-bottom: 5px;
      margin-left: 6px;
    }
  }
`;

const ConfirmBetButton = styled.div`
  background: linear-gradient(180deg, #32b475 0%, #117b48 100%);
  border-radius: 4px;
  width: 128px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }

  &.isDisabled {
    background: #c9c9c9;
    border-radius: 4px;
    color: #ffffff;
    opacity: 0.9;
    cursor: not-allowed;
  }
`;

const BetBlockWrap = styled.div`
  width: 100%;
  min-height: 133px;
  background: #e8e9ed;
  border: 1px solid #d3d3d3;
  border-radius: 4px 8px;
  padding: 52px 16px 20px;
  position: relative;
  margin-bottom: 8px;

  > .remove-button {
    cursor: pointer;
    width: 24px;
    height: 24px;
    position: absolute;
    right: -14px;
    top: -10px;
    z-index: 1;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }

  > .bet-title {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 700;
    font-size: 12px;
    line-height: 18px;
    color: #ffffff;
    padding: 0 16px;
    background: #49463d;
    position: absolute;
    left: 3px;
    top: 4px;

    > svg {
      margin-right: 8px;
    }
  }

  > .top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  > .bottom {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .label {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 18px;
      color: #747474;
      opacity: 0.8;
      width: 93px;
      margin-right: 15px;
      flex-shrink: 0;
    }
  }

  > .right {
    width: 178px;
  }

  .single-bet-info {
    background: #d5d7e1;
    border-radius: 2px;
    width: 100%;
    flex-shrink: 1;
    height: 25px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .label {
      font-weight: 700;
      font-size: 12px;
      line-height: 17px;
      color: #666666;
    }
    .value {
      font-weight: 700;
      font-size: 12px;
      line-height: 17px;
      color: #49463d;
    }
  }
`;

const BetInputWrap = styled.div`
  width: 500px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;

  > input {
    width: 100%;
    height: 100%;
    border: none !important;
    outline: none !important;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    color: #49463d;
  }
`;

const BetActionWrap = styled.div`
  width: 100%;
  height: 48px;
  margin-bottom: 12px;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  > span {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    color: #49463d;
  }

  > .minus,
  > .plus {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    width: 32px;
    cursor: pointer;
    height: 48px;
    opacity: 0.9;

    &:hover {
      opacity: 1;
    }
  }
`;

const BetAmountWrap = styled.div`
  width: 100%;
  height: 48px;
  background: #f1f1f1;
  border: 1px solid #9b9c97;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > .value {
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    color: #a38960;
    margin-bottom: 4px;
  }
  > .label {
    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    color: #000000;
    opacity: 0.2;
  }
`;

const ConnectInfoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 72px;

  > span {
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    color: #000000;
    opacity: 0.5;
    margin-bottom: 16px;
    margin-top: 8px;
  }
`;
