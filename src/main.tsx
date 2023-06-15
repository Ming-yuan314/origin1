import './utils/polyfills';
import './styles/index.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, goerli, mainnet, optimism, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import { WalletProvider } from '@/web3/WalletProvider';

import { IntlProvider } from './components/hoc/IntlProvider';
import GlobalStyles from './styles/GlobalStyles';
import Router from './routers/index';
import store from './store';

const { chains, publicClient } = configureChains([goerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'Luckywins Project',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

// @ts-ignore
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        {/* @ts-ignore */}
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            <WalletProvider>
              <IntlProvider>
                <GlobalStyles />
                <Router />
              </IntlProvider>
            </WalletProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ReduxProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
