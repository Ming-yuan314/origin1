import styled from '@emotion/styled';
import { PlayerProps, useRecentlyResult } from '@/hooks/queries/useLuckywinsApis';
import React, { useMemo } from 'react';
import { transferAttrArrToObject } from '@/utils/format';

import { ReactComponent as HpSvg } from '@/static/img/luckywins/horse_hp.svg';
import { ReactComponent as StaminaSvg } from '@/static/img/luckywins/horse_stamina.svg';
import { ReactComponent as SpurtSvg } from '@/static/img/luckywins/horse_spurt.svg';
import { ReactComponent as SpeedSvg } from '@/static/img/luckywins/horse_speed.svg';
import { ReactComponent as TechSvg } from '@/static/img/luckywins/jockey_tech.svg';
import { ReactComponent as BalanceSvg } from '@/static/img/luckywins/jockey_balance.svg';
import { ReactComponent as WeightSvg } from '@/static/img/luckywins/jockey_weight.svg';
import { ReactComponent as ToughSvg } from '@/static/img/luckywins/horse_tough.svg';
import { ReactComponent as DirectionLeftSvg } from '@/static/img/luckywins/direction_left.svg';
import { ReactComponent as DirectionRightSvg } from '@/static/img/luckywins/direction_right.svg';
import { ReactComponent as DirectionMiddleSvg } from '@/static/img/luckywins/direction_mid.svg';
import { ReactComponent as SunnySvg } from '@/static/img/luckywins/sunny.svg';
import { ReactComponent as CloudySvg } from '@/static/img/luckywins/cloudy.svg';
import { ReactComponent as RainySvg } from '@/static/img/luckywins/rainy.svg';
import { ReactComponent as DistanceSvg } from '@/static/img/luckywins/icon_distance.svg';
import { ReactComponent as DustSvg } from '@/static/img/luckywins/dust.svg';
import { ReactComponent as TurfSvg } from '@/static/img/luckywins/turf.svg';
import AttrPolygonPng from '@/static/img/luckywins/attr_polygon.png';
import RecentResult from './RecentResult';

interface MetadataWrapProps {
  playerData: PlayerProps;
  isActive: boolean;
}

const HorseMetadataMap = [
  {
    key: 'HP',
    name: 'HP',
    icon: <HpSvg />,
    hasBg: true,
  },
  {
    key: 'Stamina',
    name: 'Stamina',
    icon: <StaminaSvg />,
  },
  {
    key: 'Burst',
    name: 'Spurt',
    icon: <SpurtSvg />,
    hasBg: true,
  },
  {
    key: 'Speed',
    name: 'Speed',
    icon: <SpeedSvg />,
  },
];

const JockeyMetadataMap = [
  {
    key: 'HP',
    name: 'HP',
    icon: <HpSvg />,
    hasBg: true,
  },
  {
    key: 'Technique',
    name: 'Technique',
    icon: <TechSvg />,
  },
  {
    key: 'Balance',
    name: 'Balance',
    icon: <BalanceSvg />,
    hasBg: true,
  },
  {
    key: 'Weight',
    name: 'Weight',
    icon: <WeightSvg />,
  },
];

const HorseAttrMap: Record<string, Record<string, JSX.Element>> = {
  'Weather Preference': {
    Rainy: <RainySvg />,
    Sunny: <SunnySvg />,
    Cloudy: <CloudySvg />,
  },
  'Course Preference': {
    Left: <DirectionLeftSvg />,
    Right: <DirectionRightSvg />,
    Straight: <DirectionMiddleSvg />,
  },
  'Pref. Track Type': {
    Turf: <TurfSvg />,
    Dirt: <DustSvg />,
  },
};

const MetadataWrap: React.FC<MetadataWrapProps> = ({ playerData, isActive }) => {
  const { data: recentlyResult } = useRecentlyResult(
    {
      params: { gameUserId: playerData?.userId },
      key: playerData?.userId,
    },
    {
      enabled: Boolean(playerData?.userId) && isActive,
    },
  );

  const horseAttrMetadata = useMemo(() => {
    try {
      const metadata = JSON.parse(playerData.horseAttr);
      return transferAttrArrToObject(metadata.attributes);
    } catch (error) {
      return {};
    }
  }, [playerData]);

  const getAttr = (attr: string, value: 'svg' | 'attr') => {
    const SvgMap = HorseAttrMap?.[attr];
    const targetAttr = horseAttrMetadata?.[attr];
    if (value === 'svg') {
      return SvgMap?.[targetAttr] || <></>;
    }
    if (value === 'attr') {
      return targetAttr || '-';
    }
  };

  console.log(horseAttrMetadata, 'check horse attr');

  const jockeyAttrMetadata = useMemo(() => {
    try {
      const metadata = JSON.parse(playerData.jockeyAttr);
      return transferAttrArrToObject(metadata.attributes);
    } catch (error) {
      return {};
    }
  }, [playerData]);

  return (
    <MetadataWrapWrapper>
      <div className="result-title">Recently Result</div>
      <RecentResult rankData={recentlyResult} />

      <div className="metadata-line">
        <div className="horse-metadata">
          <div className="result-title">
            Horse <span>#{playerData?.horseId}</span>
          </div>
          <div className="left">
            {HorseMetadataMap.map((data) => (
              <SingleMetadata key={'horse_' + data.key} hasBg={data.hasBg}>
                <div className="label">
                  {data.icon}
                  {data.name}
                </div>
                <div className="value">{horseAttrMetadata?.[data.key] || '-'}</div>
              </SingleMetadata>
            ))}
          </div>
          <div className="right">
            <SingleMetadata hasBg>
              <div className="label">
                <ToughSvg />
                Toughness
              </div>
              <div className="value">{horseAttrMetadata?.['Toughness'] || '-'}</div>
            </SingleMetadata>

            <AttrWrap>
              <SingleAttr>
                <div className="img-wrap">
                  {getAttr('Course Preference', 'svg')}
                  <img src={AttrPolygonPng} alt="" />
                </div>

                <span>{getAttr('Course Preference', 'attr')}</span>
              </SingleAttr>
              <SingleAttr>
                <div className="img-wrap">
                  {getAttr('Weather Preference', 'svg')}
                  <img src={AttrPolygonPng} alt="" />
                </div>

                <span>{getAttr('Weather Preference', 'attr')}</span>
              </SingleAttr>
              <SingleAttr>
                <div className="img-wrap">
                  <DistanceSvg />
                  <img src={AttrPolygonPng} alt="" />
                </div>

                <span>{horseAttrMetadata?.['Distance'] || '-'}</span>
              </SingleAttr>
              <SingleAttr>
                <div className="img-wrap">
                  {getAttr('Pref. Track Type', 'svg')}
                  <img src={AttrPolygonPng} alt="" />
                </div>

                <span>{getAttr('Pref. Track Type', 'attr')}</span>
              </SingleAttr>
            </AttrWrap>
          </div>
        </div>

        <div className="divide-line"></div>

        <div className="jockey-metadata">
          <div className="result-title">
            Jockey <span>#{playerData?.jockeyId}</span>
          </div>
          {JockeyMetadataMap.map((data) => (
            <SingleMetadata key={'jockey_' + data.key} hasBg={data.hasBg}>
              <div className="label">
                {data.icon}
                {data.name}
              </div>
              <div className="value">{jockeyAttrMetadata?.[data.key] || '-'}</div>
            </SingleMetadata>
          ))}
        </div>
      </div>
    </MetadataWrapWrapper>
  );
};

export default MetadataWrap;

const MetadataWrapWrapper = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: space-between; */

  .result-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #777777;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;

    > span {
      color: #000;
      margin-left: 6px;
    }
  }

  > .metadata-line {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .divide-line {
      width: 1px;
      height: 160px;
      background: #a9a9ab;
      margin: 0 24px;
    }

    > .horse-metadata {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding-top: 34px;
      position: relative;

      > .result-title {
        position: absolute;
        left: 0;
        top: 0;
        margin-top: 0;
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }

      > .right {
        margin-left: 18px;
      }
      > .left,
      > .right {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
      }
    }

    > .jockey-metadata {
      > .result-title {
        margin-top: 0;
        margin-bottom: 16px;
      }

      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
    }
  }
`;

const SingleMetadata = styled.div<{ hasBg?: boolean }>`
  width: 180px;
  height: 26px;
  background: ${(props) => (props.hasBg ? '#cbcbcd' : 'none')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 8px;

  &:last-of-type {
    margin-bottom: 0;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #4c4c4e;

    > svg {
      margin-right: 4px;
    }
  }
  .value {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #4c4c4e;
  }
`;

const AttrWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 16px;
`;

const SingleAttr = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 80px;

  .img-wrap {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;

    > img {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      bottom: 0;
      top: 0;
      right: 0;
      margin: auto;
    }
    > svg {
      z-index: 1;
    }
  }

  > span {
    font-weight: 700;
    font-size: 12px;
    line-height: 17px;
    color: #000000;
    margin-left: 8px;
  }
`;
