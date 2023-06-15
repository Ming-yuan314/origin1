import styled from '@emotion/styled';
import FieldBg from '@/static/img/luckywins/field_bg.png';
import Field1OffBg from '@/static/img/luckywins/field_1_off.png';
import Field1OnBg from '@/static/img/luckywins/field_1_on.png';
import { ReactComponent as RaceAwardSvg } from '@/static/img/luckywins/race_award.svg';
import { ReactComponent as RaceGateSvg } from '@/static/img/luckywins/race_gate.svg';
import { ReactComponent as RaceTimeSvg } from '@/static/img/luckywins/race_time.svg';

import { RaceViewType } from './SideBar';
import type { RaceListResult } from '@/hooks/queries/useLuckywinsApis';
import TextCountDown from '@/components/enhanced/TextCountDonw';
import dayjs from 'dayjs';
import { useMemo } from 'react';

interface SingleRaceProps {
  isActive: boolean;
  viewType: RaceViewType;
  handleSelect: (id: number) => void;
  id: number;
  raceData: RaceListResult;
}

const SingleRace: React.FC<SingleRaceProps> = ({
  isActive,
  viewType,
  id,
  handleSelect,
  raceData,
}) => {
  const leftTime = useMemo(() => {
    const { startTime } = raceData;
    if (!startTime) {
      return 0;
    }

    return dayjs(startTime).unix() - dayjs().unix();
  }, [raceData]);

  return (
    <SingleRaceWrapper onClick={() => handleSelect(id)} isActive={isActive}>
      <div className="left-bar"></div>

      <RaceWrap isActive={isActive}>
        <div className="header-line">
          <RaceAwardSvg />
          {raceData.matchAddress}, {raceData.matchCountry}
        </div>

        <div className="content-left">
          <div className="bg-wrap">
            {isActive ? (
              <img src={Field1OnBg} alt="" className="field-img" />
            ) : (
              <img src={Field1OffBg} alt="" className="field-img" />
            )}
            <img src={FieldBg} alt="" className="bg-img" />
          </div>
        </div>

        {viewType === RaceViewType.TIME && (
          <TimeInfoGroup>
            <div className="info-line">
              <div className="left">
                <RaceGateSvg />
                No. of Gate
              </div>
              <div className="right">
                {raceData.count}
                <span>/18</span>
              </div>
            </div>
            {leftTime > 0 ? (
              <div className="info-line">
                <div className="left">
                  <RaceTimeSvg />
                  Count down
                </div>
                <div className="right">
                  {/* @ts-ignore: Unreachable code error */}
                  <TextCountDown leftTime={leftTime * 1000} />
                </div>
              </div>
            ) : (
              <div className="info-line">
                <div className="left">
                  <RaceTimeSvg />
                  Match is end
                </div>
              </div>
            )}
          </TimeInfoGroup>
        )}
        {viewType === RaceViewType.DETAIL && (
          <DetailInfoGroup>
            <div className="info-line">
              <div className="left">Venue Type</div>
              <div className="right">{raceData.siteType}</div>
            </div>
            <div className="info-line">
              <div className="left">Weather Colum</div>
              <div className="right">Rainy</div>
            </div>
            <div className="info-line">
              <div className="left">Distance</div>
              <div className="right">{raceData.distance}</div>
            </div>
            <div className="info-line">
              <div className="left">Track Deraction</div>
              <div className="right">{raceData.runwayDirection}</div>
            </div>
          </DetailInfoGroup>
        )}
      </RaceWrap>
    </SingleRaceWrapper>
  );
};

export default SingleRace;

const SingleRaceWrapper = styled.div<{ isActive: boolean }>`
  width: 343px;
  height: 136px;
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
  cursor: pointer;

  > .left-bar {
    width: 8px;
    height: 100%;
    margin-right: 7px;
    background: ${(props) => (props.isActive ? '#ECD3AE' : 'none')};
  }
`;

const RaceWrap = styled.div<{ isActive: boolean }>`
  width: 328px;
  height: 136px;
  border: 1px solid #ebd9b5;
  border-radius: 0px 8px;
  position: relative;
  overflow: hidden;
  background: #5e544f;

  > .header-line {
    width: 322px;
    height: 32px;
    padding-left: 5.5px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: ${(props) => (props.isActive ? '#E8D4B2' : '#2C2420')};
    border-radius: 0px 6px 0px 0px;
    font-family: 'Alibaba PuHuiTi 2.0';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 12px;
    color: ${(props) => (props.isActive ? '#2C2420' : '#AD9C7E')};
    position: absolute;
    top: 2px;
    left: 2px;

    > svg {
      margin-right: 4px;

      path {
        fill: ${(props) => (props.isActive ? '#373022' : '#AD9C7E')};
      }
    }
  }
  .content-left {
    width: 107px;
    height: 136px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background: linear-gradient(154.04deg, rgba(109, 78, 48, 0) 0%, #3e322d 100%);
    padding-bottom: 8px;

    > .bg-wrap {
      width: 88px;
      height: 88px;
      position: relative;
      z-index: 1;

      > .field-img {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        right: 0;
      }
      > .bg-img {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

const TimeInfoGroup = styled.div`
  width: 219px;
  height: 136px;
  padding: 52px 15px 0;
  position: absolute;
  right: 0;
  bottom: 0;

  > .info-line {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    &:last-of-type {
      margin-bottom: 0;
    }

    > .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-family: 'Alibaba PuHuiTi 2.0';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      color: #b7aaa4;

      > svg {
        margin-right: 4px;
      }
    }
    > .right {
      font-family: 'Alibaba PuHuiTi 2.0';
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 18px;
      color: #dec3b4;

      > span {
        color: #fff;
        font-size: 14px;
      }
    }
  }
`;

const DetailInfoGroup = styled.div`
  width: 219px;
  height: 136px;
  padding: 39px 15px 0;
  position: absolute;
  right: 0;
  bottom: 0;

  > .info-line {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    border-bottom: 1px dashed #b7aaa4;

    &:last-of-type {
      margin-bottom: 0;
    }

    > .left {
      font-family: 'Alibaba PuHuiTi 2.0';
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      color: #b7aaa4;
    }
    > .right {
      font-family: 'Alibaba PuHuiTi 2.0';
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      line-height: 18px;
      color: #dec3b4;
    }
  }
`;
