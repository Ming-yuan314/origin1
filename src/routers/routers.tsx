import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Loadable from 'react-loadable'
import Index from '@/pages/Index';
import LuckyWins from '@/pages/LuckyWins';
import BetHistory from '@/pages/BetHistory';
import RaceHistory from '@/pages/RaceHistory';
import Claim from '@/pages/Claim';
// import Dashboard from 'pages/Dashboard'

const AppRoutes = () => {
  return (
    <Suspense fallback={<>loading</>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            <Route index element={<LuckyWins />} />
            <Route path="history" element={<RaceHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRoutes;
