import {
  PlayerProps,
  RaceDetailResult,
  RaceListResult,
  useRaceDetail,
} from '@/hooks/queries/useLuckywinsApis';
import styled from '@emotion/styled';
import 'twin.macro';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as YoutubeSvg } from '@/static/img/luckywins/youtube_icon.svg';
import clsx from 'clsx';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import LabelNormalPng from '@/static/img/luckywins/player_label_normal.png';
import LabelGreenPng from '@/static/img/luckywins/player_label_green.png';
import LabelBrownPng from '@/static/img/luckywins/player_label_brown.png';
import { RANK_IMG_MAP } from '@/pages/LuckyWins/components/RecentResult';
import MetadataWrap from '@/pages/LuckyWins/components/MetadataWrap';
interface RaceResultProps {
  raceData: RaceListResult;
  isExtend: boolean;
  handleCollapse: (v: number) => void;
}

interface ExpandContentProps {
  detailData: RaceDetailResult | undefined;
  isLoading: boolean;
  extendContentHeight: number;
  showContent: boolean;
  isExtend: boolean;
}

interface PlayerLabelProps {
  playerData: PlayerProps;
  index: number;
  curActiveGroup: ActiveGroupProps[];
  handleActivatePlayer: () => void;
}

const PlayerLabel = memo(
  ({ playerData, index, curActiveGroup, handleActivatePlayer }: PlayerLabelProps) => {
    const activeColor = useMemo(() => {
      const isActivePlayer = curActiveGroup.find((x) => x.playerIndex === index);
      if (!isActivePlayer) {
        return false;
      }
      return isActivePlayer.color;
    }, [curActiveGroup]);

    const renderBgImg = useMemo(() => {
      if (!activeColor) {
        return <img className="normal" src={LabelNormalPng} alt="" />;
      }
      if (activeColor === 'green') {
        return <img src={LabelGreenPng} alt="" />;
      }
      return <img src={LabelBrownPng} alt="" />;
    }, [activeColor]);

    return (
      <PlayerLabelWrap
        className={clsx(!activeColor && 'normal')}
        onClick={handleActivatePlayer}
      >
        {renderBgImg}

        <div className="number-label">No.{playerData.playerNumber}</div>
        <RankImgWrap>
          {RANK_IMG_MAP?.[playerData.score] ? (
            RANK_IMG_MAP[playerData.score]
          ) : (
            <div className="rank-text">{playerData.score}</div>
          )}
        </RankImgWrap>
        <div className="number-wrap">#{playerData.horseId}</div>
      </PlayerLabelWrap>
    );
  },
);

type ActiveGroupProps = {
  playerIndex: number;
  color: string;
  index: number;
};

const colorMap = ['green', 'brown'];

const ExpandContent = memo(
  ({
    detailData,
    isLoading,
    extendContentHeight,
    showContent,
    isExtend,
  }: ExpandContentProps) => {
    if (!detailData && isLoading) {
      return (
        <ExtendContent height={extendContentHeight} isShow={showContent}>
          <div>Loading</div>
        </ExtendContent>
      );
    }

    const [curActiveGroup, setCurActiveGroup] = useState<ActiveGroupProps[]>([]);
    const nextLabelProps = useRef<number>(0);

    const handleActivatePlayer = (index: number) => {
      if (curActiveGroup.some((x) => x.playerIndex === index)) {
        return;
      }
      // if (curActiveGroup.length < 2) {
      //   setCurActiveGroup((v) => {
      //     v[nextLabelProps.current] = {
      //       index: nextLabelProps.current,
      //       color: colorMap[nextLabelProps.current],
      //       playerIndex: index,
      //     };
      //     return v;
      //   });
      //   nextLabelProps.current = (nextLabelProps.current + 1) % 2;
      //   return;
      // }
      const _curActiveGroup = JSON.parse(JSON.stringify(curActiveGroup));
      _curActiveGroup[nextLabelProps.current] = {
        playerIndex: index,
        color: colorMap[nextLabelProps.current],
        index: nextLabelProps.current,
      };
      setCurActiveGroup(_curActiveGroup);
      nextLabelProps.current = (nextLabelProps.current + 1) % 2;
      return;
    };
    // const handleCancelPlayer = (index: number) => {};

    return (
      <ExtendContent height={extendContentHeight} isShow={showContent}>
        <PlayerWrap>
          {!!detailData?.players?.length &&
            detailData.players.map((player, index) => (
              <PlayerLabel
                key={`player_${index}`}
                playerData={player}
                curActiveGroup={curActiveGroup}
                index={index}
                handleActivatePlayer={() => handleActivatePlayer(index)}
              />
            ))}
        </PlayerWrap>

        <MetadataGroup>
          {curActiveGroup.length > 0 &&
            curActiveGroup.map((activePlayer) => (
              <SingleMetadata className={activePlayer.color}>
                <MetadataWrap
                  playerData={detailData!.players[activePlayer.playerIndex]}
                  isActive={isExtend}
                />
              </SingleMetadata>
            ))}
        </MetadataGroup>
      </ExtendContent>
    );
  },
);

const PlayerWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`;

const MetadataGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
`;

const SingleMetadata = styled.div`
  width: 704px;
  height: 307px;
  background: #d5d6da;
  padding: 16px 24px 0;

  &.green {
    border-top: 4px solid #127457;
  }
  &.brown {
    border-top: 4px solid #8a5626;
  }
`;

const RaceResultListItem: React.FC<RaceResultProps> = memo(
  ({ raceData, isExtend, handleCollapse }) => {
    const { isActive, isAuthenticated, account } = useActiveWeb3React();

    // useEffect(() => {
    //   setIsExtend(false);
    // }, []);

    // collapse action and effect
    const [showContent, setShowContent] = useState(false);
    // const [isExtend, setIsExtend] = useState(false);

    const { data: detailData, isFetching } = useRaceDetail(
      { params: { id: raceData.id }, key: raceData.id },
      {
        enabled: Boolean(raceData.id) && isExtend,
        keepPreviousData: true,
      },
    );

    console.log(detailData, 'check data');

    useEffect(() => {
      if (isExtend) {
        setTimeout(() => {
          setShowContent(true);
        }, 200);
      } else {
        setShowContent(false);
      }
    }, [isExtend]);

    const extendContentHeight = useMemo(() => {
      if (!isActive) {
        return isExtend ? 454 : 0;
      }
      const _baseHeight = 454;
      return isExtend ? _baseHeight : 0;
    }, [isExtend, isActive]);

    const extendHeight = useMemo(() => {
      return extendContentHeight;
    }, [extendContentHeight]);

    // const handleCollapse = useCallback(() => {
    //   setIsExtend((v) => {
    //     return !v;
    //   });
    // }, []);
    const championHorse = useMemo(() => {
      if (!detailData?.players) {
        return '-';
      }
      return detailData.players.find((x) => x.score === 1)?.horseId || '-';
    }, [detailData]);

    return (
      <RaceResultListItemWrapper>
        <InfoPanel
          className={clsx(isExtend && 'isActive')}
          onClick={() => handleCollapse(raceData.id)}
        >
          <div className="label" tw="w-[240px]">
            {raceData.matchName}
          </div>
          <div className="label" tw="w-[160px]">
            {raceData.endTime}
          </div>
          <div className="label" tw="w-[80px]">
            {raceData.runwayDirection}
          </div>
          <div className="label" tw="w-[80px]">
            -
          </div>
          <div className="label" tw="w-[80px]">
            {raceData.distance}
          </div>
          <div className="label" tw="w-[80px]">
            {raceData.siteType}
          </div>
          <div className="label" tw="w-[140px]">
            Championship
          </div>
          <div className="label" tw="w-[100px]">
            #{championHorse}
          </div>
          <div className="label" tw="w-[100px]">
            4300
          </div>
          <div className="label" tw="w-[100px]">
            <YoutubeSvg />
          </div>
        </InfoPanel>
        <ExtendPanel height={extendHeight}>
          <ExpandContent
            detailData={detailData}
            isLoading={!!isFetching}
            isExtend={isExtend}
            extendContentHeight={extendContentHeight}
            showContent={showContent}
          />
        </ExtendPanel>
      </RaceResultListItemWrapper>
    );
  },
);

export default RaceResultListItem;

const RaceResultListItemWrapper = styled.div`
  width: 100%;
  height: auto;
  margin-bottom: 16px;
`;

const InfoPanel = styled.div`
  width: 100%;
  height: 75px;
  background: #e6e7ea;
  box-shadow: 0px 0px 1px 1px rgba(36, 43, 61, 0.16);
  border-radius: 0px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  cursor: pointer;

  > .label {
    text-align: center;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    color: #111;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-of-type {
      text-align: left;
      justify-content: flex-start;
    }
  }

  &.isActive {
    background: #007e33;

    > .label {
      color: #f1f3f6;
    }
  }
`;

const ExtendContent = styled.div<{ isShow: boolean; height: number }>`
  width: 100%;
  transition: all 0.3s;
  height: ${(props) => props.height + 'px'};
  opacity: ${(props) => (props.isShow ? 1 : 0)};
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding: ${(props) => (props.isShow ? '0 16px 24px' : 0)};
  border-top: none;

  > .pointer-wrap {
    position: absolute;
    right: 294px;
  }

  .result-block {
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
  }
`;

const ExtendPanel = styled.div<{ height: number }>`
  min-height: 0;
  width: 100%;
  height: ${(props) => props.height + 'px'};
  left: 0;
  position: relative;
  transition: all 0.5s;

  > .inner {
    border: 1px solid #9b9c97;
    width: 100%;
    height: 100%;
  }
`;

const PlayerLabelWrap = styled.div`
  width: 74px;
  height: 192px;
  margin-top: -64px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 100px;

  > img {
    position: absolute;
    top: 0;
    left: 0;

    &.normal {
      width: 74px;
      cursor: pointer;
      height: 184px;
    }
    &.active {
      width: 74px;
      height: 192px;
    }
  }

  &.normal {
    &:hover {
      transform: translateY(8px);
      transition: all 0.5s;
      cursor: pointer;
    }
  }

  .number-label {
    position: absolute;
    right: 6px;
    top: 72px;
    z-index: 1;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 12px;
    color: #666666;
  }
  .number-wrap {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 12px;
    color: #4b4848;
    position: relative;
    z-index: 1;
  }
`;

const RankImgWrap = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
  margin-bottom: 8px;

  > img {
    width: 100%;
    height: 100%;
  }
`;
