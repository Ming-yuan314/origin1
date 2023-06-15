import { selectDesiredChainId } from '@/store/globalConfig';
import styled from '@emotion/styled';
// import {useActiveWeb3React} from './wallet/connectors/Web3WalletProvider'
import { useSelector } from 'react-redux';
import UniDaiPng from 'static/img/uni_dai.png';
import UniFraxPng from 'static/img/uni_frax.png';
import UniUsdcPng from 'static/img/uni_usdc.png';
import UniUsdtPng from 'static/img/uni_usdt.png';
import UniWbtcPng from 'static/img/uni_wbtc.png';
import UniWethPng from 'static/img/uni_weth.png';

export const useTokenAddr = (): TokenAddrReturns => {
  const currentChainId = useSelector(selectDesiredChainId);

  return {
    FTN_TOKEN_ADDR: FTN_TOKEN_ADDRESS_MAP[currentChainId],
    SFTN_TOKEN_ADDR: SFTN_TOKEN_ADDRESS_MAP[currentChainId],
    FARM_ADDR: FARM_ADDRESS_MAP[currentChainId],
    AVAIL_POOLS: AVAIL_POOLS_MAP[currentChainId],
    CLINK_ADDRESS: CLINK_ADDRESS_MAP[currentChainId],
  };
};

export const AVAIL_POOLS_MAP: Record<number, Record<string, string>> = {
  42: {
    WETH: '0x70eabeda3c96d26ea34a0c871c69130a02972d53',
    USDT: '0xe8522996c56bd5fdb31ee558397c8f537e0bf5d3',
    FTN: '0x8fcbac0b8a38d3dc3fc691eb99086326e59b5484',
    WBTC: '0xcf397a162b6930403e60334a29c93b1abf70eb0b',
  },
  5: {
    WETH: '0x36bdcfcfe2a879e23178fee8f81ab64f9ff5e0b7',
    USDT: '0xb66b1376fc8db4bb13c6b09fda6d5e2989dc9400',
    // FTN: '0x8fcbac0b8a38d3dc3fc691eb99086326e59b5484',
    WBTC: '0x81190fb92289b0e68e90609d3c42eb171557216a',
  },
};

// farm contract address
export const FARM_ADDRESS_MAP: Record<number, string> = {
  42: '0xF2E5E434bC203C58BAbBdAf7fE4e499d2aEb8760',
  5: '0x8691112Ffc7B305d313110d827499646e8571D64',
};

// ftn token address
export const FTN_TOKEN_ADDRESS_MAP: Record<number, string> = {
  42: '0x5a06e2ab09a40b5d31f2ab7818652c1d1b50f0d0',
  5: '0x0ce4a807c963c09C63BCCd3f732591fe4629012f',
};

// sftn token address
export const SFTN_TOKEN_ADDRESS_MAP: Record<number, string> = {
  42: '0xa208a32c92650aed1af13a89285f00c59d0179ea',
  5: '0x93f93573FBC53bCE406886E6B3FDCf47E7beFB22',
};

export const CLINK_ADDRESS_MAP: Record<number, string> = {
  42: '0xcb8a8f4721b9b8e4487d88a838bcd31b08e466c0',
  5: '0x23b1e638f43b96c7c9ceafd70a92a91f347ba6dc',
};

// export const FTN_TOKEN_ADDR = '0x5a06e2ab09a40b5d31f2ab7818652c1d1b50f0d0'
// export const SFTN_TOKEN_ADDR = '0xa208a32c92650aed1af13a89285f00c59d0179ea'

interface TokenAddrReturns {
  FTN_TOKEN_ADDR: string;
  SFTN_TOKEN_ADDR: string;
  FARM_ADDR: string;
  CLINK_ADDRESS: string;
  AVAIL_POOLS: Record<string, string>;
}

// export const useTokenAddr = (): TokenAddrReturns => {
//   const currentChainId = useSelector(selectDesiredChainId);

//   return {
//     FTN_TOKEN_ADDR: FTN_TOKEN_ADDRESS_MAP[currentChainId],
//     SFTN_TOKEN_ADDR: SFTN_TOKEN_ADDRESS_MAP[currentChainId],
//     FARM_ADDR: FARM_ADDRESS_MAP[currentChainId],
//     AVAIL_POOLS: AVAIL_POOLS_MAP[currentChainId],
//     CLINK_ADDRESS: CLINK_ADDRESS_MAP[currentChainId],
//   };
// };

export const BALANCE_PRECISION_MAP: Record<
  string,
  { amountPrecision: number; pricePrecision: number }
> = {
  CLK: {
    amountPrecision: 2,
    pricePrecision: 2,
  },
  CJC: {
    amountPrecision: 2,
    pricePrecision: 4,
  },
  CSUSHI: {
    amountPrecision: 2,
    pricePrecision: 3,
  },
  WBTC: {
    amountPrecision: 5,
    pricePrecision: 2,
  },
  ETH: {
    amountPrecision: 4,
    pricePrecision: 2,
  },
  WETH: {
    amountPrecision: 4,
    pricePrecision: 2,
  },
  USDT: {
    amountPrecision: 2,
    pricePrecision: 2,
  },
  FTN: {
    amountPrecision: 2,
    pricePrecision: 4,
  },
  SFTN: {
    amountPrecision: 2,
    pricePrecision: 4,
  },
  'WETH-CLK': {
    amountPrecision: 2,
    pricePrecision: 2,
  },
  'CLK-WETH': {
    amountPrecision: 2,
    pricePrecision: 2,
  },
  'CLK-USDT': {
    amountPrecision: 6,
    pricePrecision: 2,
  },
  'USDT-CLK': {
    amountPrecision: 6,
    pricePrecision: 2,
  },
  'FTN-WETH': {
    amountPrecision: 2,
    pricePrecision: 2,
  },
  MIX_COLLATERAL: {
    amountPrecision: 2,
    pricePrecision: 2,
  },
};

// export const ICON_MAP = {
//   FTN: <FtnSvg />,
//   USDT: <UsdtSvg />,
//   BTC: <BtcSvg />,
//   WBTC: <BtcSvg />,
//   ETH: <EthSvg />,
//   WETH: <EthSvg />,
//   CLK: <ClkSvg />,
//   CSUSHI: <EthSvg />,
//   SFTN: <SFtnSvg />,
//   MIX_COLLATERAL: <MixCollateralSvg />,
//   UNI: <UniSvg />,
// };

// export const UNI_V3_WHITELIST_ICONS = {
//   DAI: <img className="uni-icon" src={UniDaiPng} alt="" />,
//   USDC: <img className="uni-icon" src={UniUsdcPng} alt="" />,
//   WBTC: <img className="uni-icon" src={UniWbtcPng} alt="" />,
//   WETH: <img className="uni-icon" src={UniWethPng} alt="" />,
//   USDT: <img className="uni-icon" src={UniUsdtPng} alt="" />,
//   FRAX: <img className="uni-icon" src={UniFraxPng} alt="" />,
// };

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: #313134;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #414142;

  &.farm {
    background: #313134;
    border: 1px solid #656578;
    border-radius: 16px;
  }
  &.mix {
    background: none;
    border: none;
  }
  &.big {
    width: 45px;
    height: 45px;
    background: #313134;
    border: 1px solid #414142;
    border-radius: 5.64706px;
  }
`;

// export const DetailIcon = ({
//   icon,
//   className,
//   type = 'normal',
// }: {
//   icon: string;
//   className?: string;
//   type?: 'normal' | 'farm' | 'mix' | 'big';
// }) => {
//   if (!icon) {
//     return null;
//   }
//   return (
//     <IconWrapper className={`${className} ${type}`}>
//       {ICON_MAP[icon.toUpperCase()]}
//     </IconWrapper>
//   );
// };

export interface AddEthereumChainParameter {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};
const tETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'tETH',
  decimals: 18,
};
const BNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'BNB',
  symbol: 'BNB',
  decimals: 18,
};
const tBNB: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'test BNB',
  symbol: 'tBNB',
  decimals: 18,
};

const VS: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'VS',
  symbol: 'VS',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
  alias: string;
  hexChainId?: string;
  blockExplorerUrls?: AddEthereumChainParameter['blockExplorerUrls'];
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation)?.nativeCurrency;
}

export const CHAINID_MAP = {
  BSC_TEST: 97,
  BSC_MAINNET: 56,
  ETHEREUM_ROPSTEN: 3,
  ETHEREUM_MAINNET: 1,
  ETHEREUM_KOVAN: 42,
};

export function getAddChainParameters(
  chainId: number,
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}

export const DECIMALS_MAP = {
  METAMASK_DECIMALS: 18,
  VTIMES_DECIMALS: 6,
};

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  // 1: {
  //     urls: [`https://mainnet.infura.io/v3/84842078b09946638c03157f83405213`],
  //     name: 'Ethereum Mainnet',
  //     alias: 'Ethereum',
  // },
  // 42: {
  //     urls: [`https://kovan.infura.io/v3/84842078b09946638c03157f83405213`],
  //     name: 'Kovan Test Network',
  //     alias: 'Kovan',
  //     hexChainId: '2a',
  //     blockExplorerUrls: ['https://kovan.etherscan.io/tx/'],
  // },
  // 4: {
  //     urls: [`https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213`],
  //     name: 'Rinkeby Test Network',
  //     alias: 'Rinkeby',
  //     blockExplorerUrls: ['https://rinkeby.etherscan.io/tx/'],
  // },
  // 3: {
  //     urls: [`https://ropsten.infura.io/v3/84842078b09946638c03157f83405213`],
  //     name: 'Ropsten Test Network',
  //     alias: 'Ropsten',
  // },
  // 97: {
  //     urls: ['https://data-seed-prebsc-2-s3.binance.org:8545'],
  //     name: 'BSC test Chain',
  //     nativeCurrency: tBNB,
  //     blockExplorerUrls: ['https://testnet.bscscan.com'],
  // },
  // 56: {
  //     urls: ['https://bsc-dataseed.binance.org'],
  //     name: 'BSC Mainnet',
  //     nativeCurrency: BNB,
  //     blockExplorerUrls: ['https://bscscan.com'],
  // },
  5: {
    urls: ['https://goerli.infura.io/v3/10de98d772274dd8bba24784b23e11d4'],
    name: 'Görli Test Network',
    alias: 'Goerli',
    blockExplorerUrls: ['https://goerli.etherscan.io/tx/'],
  },
  // 42: {
  //     urls: [process.env.infuraKey ? `https://kovan.infura.io/v3/84842078b09946638c03157f83405213` : undefined],
  //     name: 'Kovan',
  // },
  // // Optimism
  // 10: {
  //     urls: [
  //         process.env.infuraKey
  //             ? `https://optimism-mainnet.infura.io/v3/84842078b09946638c03157f83405213`
  //             : undefined,
  //         'https://mainnet.optimism.io',
  //     ],
  //     name: 'Optimistic Ethereum',
  //     nativeCurrency: ETH,
  //     blockExplorerUrls: ['https://optimistic.etherscan.io'],
  // },
  // Arbitrum
  // 42161: {
  //     urls: [
  //         process.env.infuraKey
  //             ? `https://arbitrum-mainnet.infura.io/v3/84842078b09946638c03157f83405213`
  //             : undefined,
  //         'https://arb1.arbitrum.io/rpc',
  //     ],
  //     name: 'Arbitrum One',
  //     nativeCurrency: ETH,
  //     blockExplorerUrls: ['https://arbiscan.io'],
  // },
  // 421611: {
  //     urls: [
  //         process.env.infuraKey
  //             ? `https://arbitrum-rinkeby.infura.io/v3/84842078b09946638c03157f83405213`
  //             : undefined,
  //         'https://rinkeby.arbitrum.io/rpc',
  //     ],
  //     name: 'Arbitrum Testnet',
  //     nativeCurrency: ETH,
  //     blockExplorerUrls: ['https://testnet.arbiscan.io'],
  // },
  // // Polygon
  // 137: {
  //     urls: [
  //         process.env.infuraKey ? `https://polygon-mainnet.infura.io/v3/84842078b09946638c03157f83405213` : undefined,
  //         'https://polygon-rpc.com',
  //     ],
  //     name: 'Polygon Mainnet',
  //     nativeCurrency: MATIC,
  //     blockExplorerUrls: ['https://polygonscan.com'],
  // },
  // 80001: {
  //     urls: [
  //         process.env.infuraKey ? `https://polygon-mumbai.infura.io/v3/84842078b09946638c03157f83405213` : undefined,
  //     ],
  //     name: 'Polygon Mumbai',
  //     nativeCurrency: MATIC,
  //     blockExplorerUrls: ['https://mumbai.polygonscan.com'],
  // },
};

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce(
  (accumulator: Record<string, string[]>, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls.filter((url) => url);

    if (validURLs.length) {
      accumulator[chainId] = validURLs;
    }

    return accumulator;
  },
  {},
);
