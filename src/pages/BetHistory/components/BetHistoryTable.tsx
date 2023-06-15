import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import _capitalize from 'lodash/capitalize';
import _uniqBy from 'lodash/uniqBy';
import OrderList from '@/components/enhanced/CustomTable';
import styled from '@emotion/styled';
import { BetDetailResult } from '@/hooks/queries/useLuckywinsApis';
import { RANK_IMG_MAP } from '@/pages/LuckyWins/components/RecentResult';
import { ReactComponent as WinsCrownSvg } from '@/static/img/luckywins/wins_crown.svg';
import clsx from 'clsx';

// const localizedFormat = require('dayjs/plugin/localizedFormat');
// dayjs.extend(localizedFormat);

export const HeaderCol = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

interface ColumnsProps {
  title?: string | JSX.Element;
  dataIndex?: string;
  key: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render: (type: any, record: any) => JSX.Element;
  fixed?: 'left' | 'right' | boolean;
}

const MATCH_STATUS_MAP: Record<number, string> = {
  1: 'Matching',
  2: 'Pending Result',
  3: 'Pending Match',
  4: 'Result Announced',
  5: 'Settled',
};

const BetHistoryTable: React.FC<{ data?: BetDetailResult[] }> = ({ data = [] }) => {
  // const MOCK_DATA = new Array(recordNum).fill('')
  const columns: ColumnsProps[] = [
    {
      title: 'Race Name',
      key: 'matchName',
      render: (matchName) => <>{matchName}</>,
      align: 'left',
      width: 200,
    },
    {
      title: 'Start Time',
      key: 'startTime',
      align: 'center',
      render: (startTime) => {
        return <>{startTime}</>;
      },
      width: 140,
    },
    {
      title: 'No.',
      key: 'betNo',
      render: (betNo, record) => {
        return <>{betNo}</>;
      },
      align: 'center',
      width: 60,
    },
    {
      title: 'Horse',
      key: 'horseId',
      render: (horseId, record) => {
        return <>{`#${horseId}`}</>;
      },
      align: 'center',
      width: 80,
    },
    {
      title: 'Jockey',
      key: 'jockeyId',
      render: (jockeyId, record) => {
        return <>{`#${jockeyId}`}</>;
      },
      align: 'center',
      width: 80,
    },
    {
      title: 'Rank',
      key: 'betNo',
      render: (betNo, record) => {
        return (
          <RankImgWrap>
            {RANK_IMG_MAP?.[betNo] ? (
              RANK_IMG_MAP[betNo]
            ) : (
              <div className="rank-text">{betNo}</div>
            )}
          </RankImgWrap>
        );
      },
      align: 'center',
      width: 80,
    },
    {
      title: 'Result Time',
      key: 'resultTime',
      render: (resultTime, record) => {
        return <>{resultTime}</>;
      },
      align: 'center',
      width: 120,
    },
    {
      title: 'Odds',
      key: 'odds',
      render: (odds, record) => {
        return <>{odds}</>;
      },
      align: 'center',
      width: 60,
    },
    {
      title: 'Bet Amount',
      key: 'betAmount',
      render: (betAmount, record) => {
        return <>{betAmount} CJC</>;
      },
      align: 'center',
      width: 80,
    },
    {
      title: 'State',
      key: 'state',
      render: (state: number, record) => {
        return <>{MATCH_STATUS_MAP?.[state] || '-'}</>;
      },
      align: 'center',
      width: 80,
    },
    {
      title: 'Result',
      key: 'result',
      render: (result, record) => {
        const isWinning = +result > 0;
        const resultTxt = isWinning ? 'Win' : 'Lose';
        return (
          <ResultWrap className={clsx(isWinning && 'wins')}>
            <div>
              {resultTxt} {isWinning && <WinsCrownSvg />}
            </div>
            <div>({result} CJC)</div>
          </ResultWrap>
        );
      },
      align: 'center',
      width: 80,
    },
  ];

  return (
    <TableWrapper>
      <BetHistoryTableWrapper style={{ color: '#fff' }}>
        <OrderList
          emptyTxt={'EMPTY'}
          renderkey={columns}
          listData={data}
          rowStyle={{
            padding: '0 20px 0 40px',
            margin: '0',
            alignItems: 'flex-start',
          }}
          headerStyle={{ height: '48px', alignItems: 'center' }}
        />
      </BetHistoryTableWrapper>
    </TableWrapper>
  );
};

export default BetHistoryTable;

const TableWrapper = styled.div`
  width: 100%;
  min-width: 1200px;
  height: auto;
  margin-bottom: 60px;

  @media (min-width: 770px) and (max-width: 1560px) {
    min-width: 1024px;
  }
`;

const BetHistoryTableWrapper = styled.div`
  width: 100%;
  height: auto;
`;

const RankImgWrap = styled.div`
  width: 40px;
  height: 40px;
  position: relative;

  > img {
    width: 100%;
    height: 100%;
  }
`;

const ResultWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  &.wins {
    color: #a67c3e;
  }
`;
