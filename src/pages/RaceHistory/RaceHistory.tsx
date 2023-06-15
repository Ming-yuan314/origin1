import 'twin.macro';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { deleteElectricRecord, selectElectricRecord } from '@/store/user';
import { formatHash } from '@/web3/format';
// import BetHistoryListItem from './components/BetHistoryListItem';

const BetHistory: React.FC = () => {
  const eHistory = useSelector(selectElectricRecord);
  const dispatch = useDispatch();

  const handleDelete = (record: any) => {
    const result = confirm('是否确定删除?');
    if (result) {
      dispatch(deleteElectricRecord(record.sign));
    }
  };

  return (
    <BetHistoryWrapper>
      <HeaderLine>{/* paginator */}</HeaderLine>
      <div className="inner">
        <RecordsWrap>
          <div className="modal-title">用电记录列表</div>
          <div className="modal-content">
            {!eHistory?.length && <Empty>No records</Empty>}

            {!!eHistory?.length &&
              eHistory.map((record, index) => (
                <ClaimHistoryListItem key={`history_${index}_${record.tx}`}>
                  <div className="label" tw="w-[120px]">
                    记录日期:
                  </div>
                  <div className="value" tw="w-[160px] text-left">
                    {record.date}
                  </div>
                  <div className="label" tw="w-[120px]">
                    用电记录:
                  </div>
                  <div className="value" tw="w-[80px]">
                    {record.value} 度
                  </div>
                  <div className="label" tw="w-[120px]">
                    签名信息:
                  </div>
                  <div className="value" tw="w-[280px]">
                    {formatHash(record.sign)}
                  </div>
                  <div className="label" tw="w-[120px]">
                    记录人:
                  </div>
                  <div className="value" tw="w-[120px]">
                    吴泽昊
                  </div>

                  <div
                    onClick={() => handleDelete(record)}
                    className="delete"
                    tw="w-[100px]"
                  >
                    删除记录
                  </div>
                </ClaimHistoryListItem>
              ))}
          </div>
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
    max-width: 1480px;
    margin: 0 auto;
  }
`;

const TableHeader = styled.div`
  width: 100%;
  height: 48px;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #49463d;
  border: 1px solid #c2c2c2;
  border-radius: 4px 4px 0px 0px;
  padding: 0 48px;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;

  > .label {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;

    &:first-of-type {
      align-items: flex-start;
    }
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

const RecordsWrap = styled.div`
  width: 1480px;
  background: #fff;
  padding: 16px 24px 24px;
  position: relative;
  min-height: 400px;

  .modal-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    font-weight: 500;
  }
`;

const ClaimHistoryListItem = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 12px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #b19f81;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: #f0f1f3;
  box-shadow: 0px 2px 8px rgba(80, 80, 80, 0.5);

  > svg {
    margin-right: 22px;
    flex-shrink: 0;
  }

  > .label {
    margin-right: 8px;
    font-weight: 600;
    font-size: 14px;
    line-height: 12px;
    color: #777777;
    flex-shrink: 0;
  }
  > .value {
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
    color: #111111;
    margin-right: 28px;
    flex-shrink: 0;
  }

  > .delete {
    color: red;
    cursor: pointer;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const Empty = styled.div`
  margin: 100px auto;
  width: 200px;
  text-align: center;
`;
