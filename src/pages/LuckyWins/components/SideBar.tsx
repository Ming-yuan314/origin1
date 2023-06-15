import tw from 'twin.macro';
import styled from '@emotion/styled';
import { useState } from 'react';
import { ReactComponent as RaceSvg } from '@/static/img/luckywins/sidebar_race.svg';
import { ReactComponent as TimeSvg } from '@/static/img/luckywins/sidebar_time.svg';
import { ReactComponent as DetailSvg } from '@/static/img/luckywins/sidebar_detail.svg';
import clsx from 'clsx';
import SingleRace from './SingleRace';
import { RaceListResult } from '@/hooks/queries/useLuckywinsApis';

export enum RaceViewType {
  TIME = 'time',
  DETAIL = 'detail',
}

interface SideBarProps {
  raceList: RaceListResult[];
  handleRaceSelected: (id: number) => void;
}

const SideBar: React.FC<SideBarProps> = ({ raceList, handleRaceSelected }) => {
  const [raceViewType, setRaceViewType] = useState<RaceViewType>(RaceViewType.TIME);
  const [curRace, setCurRace] = useState(0);

  const handleSelect = (id: number) => {
    setCurRace(id);
    handleRaceSelected(id);
  };

  return (
    <SideBarWrapper>
      <SideBarHeader>
        <HeaderLeft>
          <RaceSvg />
          Next Race
        </HeaderLeft>
        <HeaderRight>
          <div
            onClick={() => setRaceViewType(RaceViewType.TIME)}
            className={clsx('svg-wrap', raceViewType === RaceViewType.TIME && 'isActive')}
          >
            <TimeSvg />
          </div>
          <div className="dash-line"></div>
          <div
            onClick={() => setRaceViewType(RaceViewType.DETAIL)}
            className={clsx(
              'svg-wrap',
              raceViewType === RaceViewType.DETAIL && 'isActive',
            )}
          >
            <DetailSvg />
          </div>
        </HeaderRight>
      </SideBarHeader>

      {raceList.length > 0 &&
        raceList.map((data) => (
          <SingleRace
            key={data.id}
            handleSelect={handleSelect}
            raceData={data}
            id={data.id}
            viewType={raceViewType}
            isActive={curRace === data.id}
          />
        ))}
    </SideBarWrapper>
  );
};

export default SideBar;

const SideBarWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

const SideBarHeader = tw.div`
  h-[64px] flex items-center justify-between p-[16px]
`;

const HeaderLeft = tw.div`
  flex text-[#B19F81] items-center text-[14px]
  [> svg]:(mr-[8px])
`;

const HeaderRight = styled.div`
  width: 91px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #302920;
  border-radius: 32px;

  > .svg-wrap {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.2;

    &.isActive {
      opacity: 1;
    }
  }
  > .dash-line {
    width: 1px;
    height: 14px;
    background: #a5977e;
    margin: 0 9px;
  }
`;
