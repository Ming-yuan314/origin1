import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import styled from '@emotion/styled';

import 'twin.macro';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import { PlayerProps, useRecentlyResult } from '@/hooks/queries/useLuckywinsApis';
import { ReactComponent as ListIconSvg } from '@/static/img/luckywins/race_list_icon.svg';
import { ReactComponent as PointerSvg } from '@/static/img/luckywins/list_content_pointer.svg';
import { ReactComponent as BetSvg } from '@/static/img/luckywins/bet_button.svg';
import clsx from 'clsx';

import RecentResult from './RecentResult';
import MetadataWrap from './MetadataWrap';

interface RaceContentListItemProps {
  playerData?: PlayerProps;
  isRaceSelected: boolean;
  isEmpty?: boolean;
  isBetting?: boolean;
  isBuyable: boolean;
  handleBetClick?: (v: PlayerProps) => void;
}

interface ExpandContentProps {
  playerData: PlayerProps;
  extendContentHeight: number;
  showContent: boolean;
  isExtend: boolean;
}

const ExpandContent = memo(
  ({ playerData, extendContentHeight, showContent, isExtend }: ExpandContentProps) => {
    return (
      <ExtendContent height={extendContentHeight} isShow={showContent}>
        <div className={clsx('pointer-wrap', isExtend && 'show')}>
          <PointerSvg />
        </div>

        <MetadataWrap playerData={playerData} isActive={isExtend} />
      </ExtendContent>
    );
  },
);

const RaceContentListItem: React.FC<RaceContentListItemProps> = ({
  playerData,
  isRaceSelected,
  isEmpty,
  isBetting,
  isBuyable,
  handleBetClick,
}) => {
  const { isActive, isAuthenticated } = useActiveWeb3React();

  useEffect(() => {
    setIsExtend(false);
  }, []);

  // collapse action and effect
  const [showContent, setShowContent] = useState(false);
  const [isExtend, setIsExtend] = useState(false);

  useEffect(() => {
    if (!isRaceSelected) {
      setIsExtend(false);
    }
  }, [isRaceSelected]);

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
      return isExtend ? 320 : 0;
    }
    const _baseHeight = 320;
    return isExtend ? _baseHeight : 0;
  }, [isExtend, isActive]);

  const extendHeight = useMemo(() => {
    return extendContentHeight;
  }, [extendContentHeight]);

  const handleCollapse = useCallback(() => {
    setIsExtend((v) => {
      return !v;
    });
  }, []);

  return (
    <RaceContentListItemWrapper isEmpty={!!isEmpty}>
      <InfoPanel>
        <div className="inner">
          <ListIconSvg />
          {isEmpty ? (
            <>
              {' '}
              <div className="label">No.</div>
              <div className="value" tw="w-[40px]"></div>
              <div className="label">Horse</div>
              <div className="value" tw="w-[70px]"></div>
              <div className="label">Jockey</div>
              <div className="value" tw="w-[70px]"></div>
              <div className="label">Odds</div>
              <div className="value" tw="w-[40px]"></div>
            </>
          ) : (
            <>
              {' '}
              <div className="label">No.</div>
              <div className="value" tw="w-[40px]">
                {playerData?.id}
              </div>
              <div className="label">Horse</div>
              <div className="value" tw="w-[70px]">
                #{playerData?.horseId}
              </div>
              <div className="label">Jockey</div>
              <div className="value" tw="w-[70px]">
                #{playerData?.jockeyId}
              </div>
              <div className="label">Odds</div>
              <div className="value" tw="w-[40px]">
                {playerData?.odds}
              </div>
            </>
          )}

          {!isEmpty && (
            <CollapseButton
              className={isExtend ? 'isExtend' : ''}
              onClick={handleCollapse}
            >
              <div className="inner">
                <>{isExtend ? 'Hide' : 'Details'}</>
              </div>
            </CollapseButton>
          )}

          {playerData && isAuthenticated && isBuyable && (
            <BetButton
              onClick={() => handleBetClick?.(playerData)}
              className={clsx(isBetting && 'isBetting')}
            >
              {isBetting ? (
                'Cancel'
              ) : (
                <>
                  <BetSvg />+ Bet
                </>
              )}
            </BetButton>
          )}
        </div>
      </InfoPanel>
      <ExtendPanel height={extendHeight}>
        <ExpandContent
          playerData={playerData!}
          isExtend={isExtend}
          extendContentHeight={extendContentHeight}
          showContent={showContent}
        />
      </ExtendPanel>
    </RaceContentListItemWrapper>
  );
};

export default RaceContentListItem;

const RaceContentListItemWrapper = styled.div<{ isEmpty: boolean }>`
  width: 100%;
  position: relative;
  margin-bottom: 10px;
  opacity: ${(props) => (props.isEmpty ? 0.4 : 1)};

  &:last-child {
    margin-right: 0;
  }
`;

const InfoPanel = styled.div`
  width: 100%;
  height: 42px;
  background: #f0f1f3;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;

  > .inner {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #b19f81;
    width: 100%;
    height: 100%;
    padding-left: 14px;
    z-index: 1;

    > svg {
      margin-right: 37px;
    }

    .label {
      margin-right: 8px;
      font-weight: 600;
      font-size: 14px;
      line-height: 12px;
      color: #777777;
    }
    .value {
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #111111;
      margin-right: 16px;
    }
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 140px;
    height: 42px;
    background: #dbdfe8;
    right: 0;
    top: 0;
  }
`;

const ExtendPanel = styled.div<{ height: number }>`
  min-height: 0;
  width: 666px;
  height: ${(props) => props.height + 'px'};
  left: 42px;
  position: relative;
  transition: all 0.5s;
  background: #d5d6da;
  padding: ${(props) => (props.height > 0 ? '2px' : '0px')};

  > .inner {
    border: 1px solid #9b9c97;
    width: 100%;
    height: 100%;
  }
`;

const CollapseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 24px;
  background: #cecece;
  padding: 2px;
  border: 1px solid #b0b0b0;
  position: relative;
  border-radius: 16px;
  cursor: pointer;

  > .inner {
    width: 100%;
    height: 100%;
    border: 1px solid #b0b0b0;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    line-height: 17px;
    color: #666666;
    text-align: center;
  }

  &.isExtend {
    opacity: 0.4;
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
  padding: ${(props) => (props.isShow ? '24px 30px 24px' : 0)};
  border: ${(props) => (props.isShow ? '1px solid #9b9c97' : 0)};
  border-top: none;

  > .pointer-wrap {
    position: absolute;
    right: 82px;
    top: 0;
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

const BetButton = styled.div`
  background: #a38960;
  border: 1px solid #92774c;
  border-radius: 16px;
  width: 88px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 24px;
  margin: auto;
  font-weight: 700;
  font-size: 12px;
  line-height: 17px;
  color: #ffffff;
  cursor: pointer;

  &.isBetting {
    background: linear-gradient(180deg, #117b48 0%, #32b475 100%);
    border: 1px solid #2c8359;
  }

  > svg {
    margin-right: 4px;
  }
`;
