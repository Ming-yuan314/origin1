import { useState } from 'react';
import RaceContent from './components/RaceContent';
import styled from '@emotion/styled';

const LuckyWins: React.FC = () => {
  const [curRaceId, setCurRaceId] = useState(0);

  return (
    <LuckyWinsWrapper>
      <RaceContent raceId={curRaceId} />
    </LuckyWinsWrapper>
  );
};

export default LuckyWins;

const LuckyWinsWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 1;
`;
