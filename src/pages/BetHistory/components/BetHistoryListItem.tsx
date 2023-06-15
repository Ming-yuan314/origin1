import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import styled from '@emotion/styled';

import 'twin.macro';
import { useActiveWeb3React } from '@/web3/WalletProvider';
import {
  BetDetailResult,
  BetHistoryResult,
  PlayerProps,
  useBetDetail,
  useRecentlyResult,
} from '@/hooks/queries/useLuckywinsApis';
import { ReactComponent as ListIconSvg } from '@/static/img/luckywins/race_list_icon.svg';
import { ReactComponent as PointerSvg } from '@/static/img/luckywins/list_content_pointer.svg';
import clsx from 'clsx';
import { formatHash } from '@/web3/format';
import BetHistoryTable from './BetHistoryTable';

interface BetHistoryListItemProps {
  recordData?: BetHistoryResult;
}

interface ExpandContentProps {
  tableData: BetDetailResult[];
  extendContentHeight: number;
  showContent: boolean;
  isExtend: boolean;
}

const ExpandContent = memo(
  ({ tableData, extendContentHeight, showContent, isExtend }: ExpandContentProps) => {
    return (
      <ExtendContent height={extendContentHeight} isShow={showContent}>
        <div className={clsx('pointer-wrap', isExtend && 'show')}>
          <PointerSvg />
        </div>

        <BetHistoryTable data={tableData} />
      </ExtendContent>
    );
  },
);

const BetHistoryListItem: React.FC<BetHistoryListItemProps> = memo(({ recordData }) => {
  const { isActive, isAuthenticated, account } = useActiveWeb3React();

  useEffect(() => {
    setIsExtend(false);
  }, []);

  // collapse action and effect
  const [showContent, setShowContent] = useState(false);
  const [isExtend, setIsExtend] = useState(false);

  const {
    data: detailData,
    isFetching,
    isRefetching,
  } = useBetDetail(
    { params: { tx: recordData?.tx || '', owner: account }, key: recordData?.tx },
    {
      enabled: Boolean(recordData?.tx && account) && isExtend,
      keepPreviousData: true,
    },
  );

  console.log(detailData, 'check detail data');
  // useEffect(() => {
  //   if (!isRaceSelected) {
  //     setIsExtend(false);
  //   }
  // }, [isRaceSelected]);

  useEffect(() => {
    if (isExtend && detailData?.length) {
      setTimeout(() => {
        setShowContent(true);
      }, 200);
    } else {
      setShowContent(false);
    }
  }, [isExtend, detailData]);

  const extendContentHeight = useMemo(() => {
    if (!isActive || !detailData?.length) {
      return isExtend && detailData?.length ? 320 : 0;
    }
    const _baseHeight = 92 + 24 + (detailData?.length || 0) * 72;
    return isExtend ? _baseHeight : 0;
  }, [isExtend, isActive, detailData]);

  const extendHeight = useMemo(() => {
    return extendContentHeight;
  }, [extendContentHeight]);

  const handleCollapse = useCallback(() => {
    setIsExtend((v) => {
      return !v;
    });
  }, []);

  return (
    <BetHistoryListItemWrapper>
      <InfoPanel>
        <div className="inner">
          <ListIconSvg />

          <>
            {' '}
            <div className="label" tw="w-[120px]">
              Transaction Time
            </div>
            <div className="value" tw="w-[160px]">
              {recordData?.betTime || '-'}
            </div>
            <div className="label" tw="w-[55px]">
              Amount
            </div>
            <div className="value" tw="w-[70px]">
              {recordData?.betFee} CJC
            </div>
            <div className="label" tw="w-[58px]">
              Tx Hash
            </div>
            <div className="value" tw="w-[260px]">
              {formatHash(recordData?.tx)}
            </div>
          </>

          <CollapseButton className={isExtend ? 'isExtend' : ''} onClick={handleCollapse}>
            <div className="inner">
              <>{isExtend ? 'Hide' : 'Details'}</>
            </div>
          </CollapseButton>

          <div className="total-result">
            <div className="label">Total result</div>
            <div className="value">+400 CJC</div>
          </div>
        </div>
      </InfoPanel>
      <ExtendPanel height={extendHeight}>
        <ExpandContent
          tableData={detailData!}
          isExtend={isExtend}
          extendContentHeight={extendContentHeight}
          showContent={showContent}
        />
      </ExtendPanel>
    </BetHistoryListItemWrapper>
  );
});

export default BetHistoryListItem;

const BetHistoryListItemWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 10px;

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
      margin-right: 22px;
    }

    > .label {
      margin-right: 8px;
      font-weight: 600;
      font-size: 14px;
      line-height: 12px;
      color: #777777;
    }
    > .value {
      font-weight: 700;
      font-size: 14px;
      line-height: 18px;
      color: #111111;
      margin-right: 48px;
    }

    > .total-result {
      height: 38px;
      width: 200px;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      > .label {
        font-weight: 700;
        font-size: 12px;
        line-height: 17px;
        color: #464248;
        opacity: 0.8;
        margin-right: 4px;
      }
      > .value {
        width: 120px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
        line-height: 18px;
        color: #333333;
        background: #b19f81;
      }
    }
  }
`;

const ExtendPanel = styled.div<{ height: number }>`
  min-height: 0;
  width: 100%;
  height: ${(props) => props.height + 'px'};
  left: 0;
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
  position: absolute;
  right: 292px;
  top: 0;
  bottom: 0;
  margin: auto;

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
  padding: ${(props) => (props.isShow ? '26px 30px 24px' : 0)};
  border: ${(props) => (props.isShow ? '1px solid #9b9c97' : 0)};
  border-top: none;

  > .pointer-wrap {
    position: absolute;
    right: 294px;
  }

  .result-title {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #777777;
    margin-top: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;

    > span {
      color: #000;
      margin-left: 6px;
    }
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
