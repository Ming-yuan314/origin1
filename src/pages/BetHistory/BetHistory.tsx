import { useBetHistory } from '@/hooks/queries/useLuckywinsApis';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { useMemo } from 'react';
import BetHistoryListItem from './components/BetHistoryListItem';

const BetHistory: React.FC = () => {
  const { account, isAuthenticated } = useActiveWeb3React();
  const { data } = useBetHistory(
    { params: { owner: account }, key: account },
    {
      enabled: isAuthenticated,
    },
  );

  const recordList = useMemo(() => {
    if (data?.content?.length) {
      return data.content;
    }
    return [];
  }, [data]);
  console.log(data, 'check data');

  const totalWins = useMemo(() => {
    if (!recordList.length) {
      return 0;
    }
    return recordList.reduce((s, x) => {
      return s + (x.totalResult || 0);
    }, 0);
  }, [recordList]);

  return (
    <BetHistoryWrapper>
      <div className="inner">
        <HeaderLine>
          <TotalWins>
            <div className="label">
              Total
              <br />
              Wins
            </div>
            <div className={clsx(totalWins >= 0 ? 'green' : 'red', 'value')}>
              {totalWins > 0 ? '+' : totalWins === 0 ? '' : '-'}
              {totalWins} CJC
            </div>
          </TotalWins>
        </HeaderLine>

        <RecordsWrap>
          {recordList.map((record) => (
            <BetHistoryListItem key={record.tx} recordData={record} />
          ))}
        </RecordsWrap>
      </div>
    </BetHistoryWrapper>
  );
};

export default BetHistory;

const BetHistoryWrapper = styled.div`
  width: 100%;
  height: auto;
  position: relative !important;
  z-index: 1;
  padding-top: 32px;

  > .inner {
    max-width: 1396px;
    margin: 0 auto;
  }
`;

const HeaderLine = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TotalWins = styled.div`
  width: 320px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 32px;
  background: #000000;
  opacity: 0.6;
  border: 1px solid #d2d2d2;
  border-radius: 47px;

  > .label {
    padding-right: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 100%;
    color: #b7b7b7;
    border-right: solid 2px #b7b7b7;
  }

  > .value {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;

    &.green {
      color: #00ce84;
    }
    &.red {
      color: red;
    }
  }
`;

const RecordsWrap = styled.div``;
