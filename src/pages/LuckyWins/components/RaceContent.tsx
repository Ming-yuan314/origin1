import { useActiveWeb3React } from '@/web3/WalletProvider';
import styled from '@emotion/styled';
import clsx from 'clsx';
import CurrentBet from './CurrentBet';

interface RaceContentProps {
  raceId: number;
}

const RaceContent: React.FC<RaceContentProps> = ({ raceId }) => {
  const { account } = useActiveWeb3React();
  return (
    <RaceContentWrapper>
      <div className={clsx('bet-content', 'show')}>
        <CurrentBet currentBets={[]} />

        <div className="inputer-wrap">
          <div className="line">
            <div className="label">当前录入人:</div>
            <div className="value">吴哲昊</div>
          </div>
          <div className="line">
            <div className="label">钱包地址:</div>
            <div className="value">{account}</div>
          </div>
        </div>
      </div>
    </RaceContentWrapper>
  );
};

export default RaceContent;

const RaceContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  height: auto;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-top: 65px;
  background: none;

  > div {
    transition: all 0.5s;
  }

  .bet-content {
    width: 720px;
    min-height: 275px;
    transform: translateX(360px);
    opacity: 0;
    top: 140px;
    left: 0;
    right: 0;
    margin: auto;

    &.show {
      transform: translateX(0);
      opacity: 1;
    }

    .inputer-wrap {
      padding: 24px;
      width: 600px;
      margin: 0 auto;

      .line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        > .label {
          font-size: 16px;
          color: #4e4e4e;
        }
        > .value {
          font-weight: bold;
        }
      }
    }
  }
`;
