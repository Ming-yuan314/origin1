import { memo } from 'react';
import styled from '@emotion/styled';
import _uniq from 'lodash/uniq';

// import useAlert from 'hooks/useAlert'

interface StyleProps {
  align?: string;
  rowStyle?: Record<string, string>;
}

interface RenderProps {
  title?: string | JSX.Element;
  key: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render: (type: any, record: any, index: number) => JSX.Element;
  fixed?: 'left' | 'right' | boolean;
}

interface OrderListProps {
  renderkey: RenderProps[];
  listData: any;
  emptyTxt: string;
  rowKey?: string;
  align?: 'flex-start' | 'space-between';
  loading?: boolean;
  onRowClick?: (record: any, index: number, event: any) => void;
  onMoreClick?: () => void;
  rowStyle?: Record<string, string>;
  headerStyle?: Record<string, string>;
  renderMore?: boolean;
  hasMore?: boolean;
}

function OrderList<T>({
  renderkey,
  listData = [],
  align = 'space-between',
  emptyTxt,
  loading,
  onRowClick,
  onMoreClick,
  rowStyle = {},
  headerStyle = {},
  renderMore,
  hasMore,
  rowKey,
}: OrderListProps) {
  return (
    <Wrapper>
      <HeaderWrap style={{ ...headerStyle }} align={align}>
        <div style={{ ...rowStyle, ...headerStyle }} className="inner">
          {renderkey.map((i, index) => {
            let style = {};
            if (i.width) {
              style = {
                width: `${i.width}px`,
              };
            }

            if (i.align) {
              style = {
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: `${i.align}`,
              };
            }

            return (
              <div className="item" style={style} key={`header_${i.title}_${index}`}>
                {i.title}
              </div>
            );
          })}
        </div>
      </HeaderWrap>
      <MainWrap>
        {/* <Loading isLoading={loading} /> */}
        {(!listData || listData.length === 0) && <Empty txt={emptyTxt} />}
        {listData &&
          listData.length > 0 &&
          listData.map((item: any, index: number) => (
            <RowItem
              style={{ ...rowStyle }}
              onClick={(e) => onRowClick && onRowClick(item, index, e)}
              key={`row_${index}${rowKey && item?.[rowKey] ? `_${item[rowKey]}` : ''}`}
              align={align}
              rowStyle={rowStyle}
            >
              {renderkey.map((i, _index) => {
                let style = {};
                if (i.width) {
                  style = {
                    width: `${i.width}px`,
                  };
                }

                if (i.align) {
                  style = {
                    ...style,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: `${i.align}`,
                  };
                }
                return (
                  <div className="item" style={style} key={i.key}>
                    {i.render(item[i.key], item, index)}
                  </div>
                );
              })}
            </RowItem>
          ))}
        {renderMore && listData.length > 0 && (
          <>
            {hasMore ? (
              <RowItem className="more-button" onClick={onMoreClick}>
                More
              </RowItem>
            ) : (
              <RowItem className="no-more">No More</RowItem>
            )}
          </>
        )}
      </MainWrap>

      {/* <SpaceItem height={40} /> */}
    </Wrapper>
  );
}

export default memo(OrderList);

const Empty = ({ txt }: { txt: string }) => (
  <EmptyWrap>
    <span className="item">{txt}</span>
  </EmptyWrap>
);

const EmptyWrap = styled.div`
  width: 100%;
  height: 88px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #3b4046 0%, #2d3037 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  margin-bottom: 0px;
  span {
    margin-top: 8px;
    color: #fff;
    font-size: 12px;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 186px;
`;

const MainWrap = styled.div`
  min-height: 0px;
  border-radius: 0px 0px 8px 8px;
  position: relative;
`;

const SpaceItem = styled.div<{ height: number }>`
  height: ${(props) => props.height}px;
  width: 100%;
  background: #292929;

  &:last-child {
    border-radius: 0 0 4px 4px;
  }
`;

const RowItem = styled.div<StyleProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.align};
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.5s;
  border-bottom: 1px solid rgba(196, 196, 196, 1);
  background: none;
  width: auto;
  border-radius: 0;
  margin: 0 32px 0 16px;
  position: relative;
  box-sizing: border-box;

  &:last-child {
    margin-bottom: 0;
    border-bottom: 0;
  }

  .item {
    flex: 1 1 0%;
    white-space: nowrap;
    color: #4c4c4e;
    text-align: center;
    flex: 0 0 auto;
    position: relative;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    height: 72px;
  }

  &.more-button {
    justify-content: center;
    color: #438eff;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
  &.no-more {
    justify-content: center;
    cursor: normal;
  }
`;

const HeaderWrap = styled.div<StyleProps>`
  width: 100%;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.align};
  margin-bottom: 16px;
  border-radius: 8px;
  margin-bottom: 0;
  background: #e6e7ea;
  border: 1px solid #f1f3f6;
  box-shadow: 0px 0px 1px 1px rgba(36, 43, 61, 0.16);
  border-radius: 0px 16px 0px 0px;
  // padding: 0 32px 0 16px;
  position: relative;
  z-index: 3;
  > .inner {
    height: 50px;
    width: 100%;
    background: #2b2d30;
    display: flex;
    align-items: center;
    justify-content: ${(props) => props.align};
    background: none;
    margin: 0 32px 0 16px;
    .item {
      flex: 1 1 0%;
      white-space: nowrap;
      font-size: 12px;
      color: #262626;
      text-align: left;
      flex: 0 0 auto;
      height: 50px;
      background: #2b2d30;
      background: none;

      font-style: normal;
      font-weight: 700;
      flex-shrink: 1;

      &.button {
        justify-content: center !important;
        flex: 0 0 auto;
        height: 24px;
        padding: 0 8px;
        background: rgba(103, 111, 129, 0.2);
        border-radius: 2px;
        color: #fff;
        cursor: pointer;
        user-select: none;

        &:hover {
          background: rgba(103, 111, 129, 0.35);
        }
      }
    }
  }
`;
