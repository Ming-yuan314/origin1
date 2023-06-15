import React, { memo } from 'react';
import styled from '@emotion/styled';

import RankImg1 from '@/static/img/luckywins/rank1.png';
import RankImg2 from '@/static/img/luckywins/rank2.png';
import RankImg3 from '@/static/img/luckywins/rank3.png';
import RankImg4 from '@/static/img/luckywins/rank4.png';
import RankImg5 from '@/static/img/luckywins/rank5.png';
import RankImg6 from '@/static/img/luckywins/rank6.png';
import RankImg7 from '@/static/img/luckywins/rank7.png';
import RankImg8 from '@/static/img/luckywins/rank8.png';
import RankImg9 from '@/static/img/luckywins/rank9.png';
import RankImg10 from '@/static/img/luckywins/rank10.png';
import RankImg11 from '@/static/img/luckywins/rank11.png';
import RankImg12 from '@/static/img/luckywins/rank12.png';
import RankImg13 from '@/static/img/luckywins/rank13.png';
import RankImg14 from '@/static/img/luckywins/rank14.png';
import RankImg15 from '@/static/img/luckywins/rank15.png';
import RankImg16 from '@/static/img/luckywins/rank16.png';
import RankImg17 from '@/static/img/luckywins/rank17.png';
import RankImg18 from '@/static/img/luckywins/rank18.png';
import PointerPng from '@/static/img/luckywins/rank_pointer.png';
import { RecentlyResultData } from '@/hooks/queries/useLuckywinsApis';

export const RANK_IMG_MAP: Record<number, JSX.Element> = {
  1: <img src={RankImg1} className="rank-img" alt="" />,
  2: <img src={RankImg2} className="rank-img" alt="" />,
  3: <img src={RankImg3} className="rank-img" alt="" />,
  4: <img src={RankImg4} className="rank-img" alt="" />,
  5: <img src={RankImg5} className="rank-img" alt="" />,
  6: <img src={RankImg6} className="rank-img" alt="" />,
  7: <img src={RankImg7} className="rank-img" alt="" />,
  8: <img src={RankImg8} className="rank-img" alt="" />,
  9: <img src={RankImg9} className="rank-img" alt="" />,
  10: <img src={RankImg10} className="rank-img" alt="" />,
  11: <img src={RankImg11} className="rank-img" alt="" />,
  12: <img src={RankImg12} className="rank-img" alt="" />,
  13: <img src={RankImg13} className="rank-img" alt="" />,
  14: <img src={RankImg14} className="rank-img" alt="" />,
  15: <img src={RankImg15} className="rank-img" alt="" />,
  16: <img src={RankImg16} className="rank-img" alt="" />,
  17: <img src={RankImg17} className="rank-img" alt="" />,
  18: <img src={RankImg18} className="rank-img" alt="" />,
};

export const RankImg = memo(({ rank, isLast }: { rank: number; isLast: boolean }) => {
  return (
    <>
      <RankImgWrapper>
        {RANK_IMG_MAP?.[rank] ? (
          RANK_IMG_MAP[rank]
        ) : (
          <div className="rank-text">{rank}</div>
        )}
      </RankImgWrapper>
      {!isLast && <RankPointer src={PointerPng} className="rank-pointer" alt="" />}
    </>
  );
});

const RecentResult: React.FC<{ rankData: RecentlyResultData[] | undefined }> = ({
  rankData = [],
}) => {
  return (
    <RecentResultWrap>
      {!!rankData?.length &&
        rankData
          .slice(0, 6)
          .map((result, index) => (
            <RankImg
              key={`result_${result.score}_${index}`}
              isLast={index === 5}
              rank={result.score}
            />
          ))}
    </RecentResultWrap>
  );
};

export default RecentResult;

const RecentResultWrap = styled.div`
  width: 100%;
  height: 56px;
  background: #e6e7ea;
  border: 1px solid #f1f3f6;
  box-shadow: 0px 0px 1px 1px rgba(36, 43, 61, 0.16);
  border-radius: 0px 16px 0px 0px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
`;

const RankImgWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  background: #e9e9e9;
  border: 1.66667px solid #ffffff;
  box-shadow: 0px 0px 1.66667px 1.66667px rgba(0, 0, 0, 0.16);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  > .rank-bg {
    width: 100%;
    height: 100%;
  }

  > .rank-img {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 1;
  }

  > .rank-text {
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 1;
    font-size: 12px;
    font-weight: bold;
    color: #686868;
  }
`;

const RankPointer = styled.img`
  width: 50px;
  height: 4px;
  margin: 0 5px;
`;
