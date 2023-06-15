import { ItemType } from '@opensea/seaport-js/lib/constants';
import { isSameAddress } from '@/utils/format';

export enum CjcNftTypes {
  ALL = 'all',
  HORSE = 'horse',
  JOCKEY = 'jockey',
  ITEMS = 'items',
  BOXES = 'boxes',
  SOUL = 'soul',
  HORSE_SOUL = 'horse_soul',
  JOCKEY_SOUL = 'jockey_soul',
  ITEM_SOUL = 'craftman_soul',
  XMETAL = 'x-metal',
  BODY = 'body',
}

export const NftAddr = {
  [CjcNftTypes.ITEM_SOUL]: '0x7ebe7500481859ceA6A6C850e767E606f9811FD8',
  [CjcNftTypes.HORSE]: '0x45Aecc4A323BfF43387ce2aAFCBeBb8271227D23',
  [CjcNftTypes.BOXES]: '0x412Dc140affe262C956b7AB14A69A35Fef6029e4',
  [CjcNftTypes.ITEMS]: '0x27f723697E5a7De707B16A055cAf93859242421b',
  [CjcNftTypes.JOCKEY]: '0x6E916A3C51Eba15e625e5A08b936Ce77bfE44653',
  [CjcNftTypes.JOCKEY_SOUL]: '0x82A87B6119C42D057c9442b5EF64e4e510c84BDB',
  [CjcNftTypes.HORSE_SOUL]: '0x120FB89Ec90A7387Caf10efB858B7987548037DE',
  [CjcNftTypes.XMETAL]: '0x2C97f7C91b28E962ae39f1B4a1580b6a58707e4C',
  [CjcNftTypes.BODY]: '0x9780A8a48d1291fDB6449E60876BbCF565cE94d3',
  [CjcNftTypes.SOUL]: '',
  [CjcNftTypes.ALL]: '',
};

export const SOULS_COLLECTION = [
  CjcNftTypes.HORSE_SOUL,
  CjcNftTypes.ITEM_SOUL,
  CjcNftTypes.JOCKEY_SOUL,
];
export const SOULS_BODY_METAL_COLLECTION = [
  CjcNftTypes.HORSE_SOUL,
  CjcNftTypes.ITEM_SOUL,
  CjcNftTypes.JOCKEY_SOUL,
  CjcNftTypes.XMETAL,
  CjcNftTypes.BODY,
];

export const NftNameMap = {
  [CjcNftTypes.HORSE_SOUL]: 'Horse Soul',
  [CjcNftTypes.JOCKEY_SOUL]: 'Jockey Soul',
  [CjcNftTypes.ITEM_SOUL]: 'Item Soul',
  [CjcNftTypes.XMETAL]: 'Alloy-X',
  [CjcNftTypes.BODY]: 'Mummified body',
  [CjcNftTypes.HORSE]: 'Horse',
  [CjcNftTypes.JOCKEY]: 'Jockey',
  [CjcNftTypes.ITEMS]: 'Items',
  [CjcNftTypes.BOXES]: 'Boxes',
  [CjcNftTypes.SOUL]: 'Soul',
};

export const ContranctToNftType = {
  [NftAddr[CjcNftTypes.HORSE].toLowerCase()]: CjcNftTypes.HORSE,
  [NftAddr[CjcNftTypes.BOXES].toLowerCase()]: CjcNftTypes.BOXES,
  [NftAddr[CjcNftTypes.ITEMS].toLowerCase()]: CjcNftTypes.ITEMS,
  [NftAddr[CjcNftTypes.JOCKEY].toLowerCase()]: CjcNftTypes.JOCKEY,
  [NftAddr[CjcNftTypes.HORSE_SOUL].toLowerCase()]: CjcNftTypes.HORSE_SOUL,
  [NftAddr[CjcNftTypes.ITEM_SOUL].toLowerCase()]: CjcNftTypes.ITEM_SOUL,
  [NftAddr[CjcNftTypes.JOCKEY_SOUL].toLowerCase()]: CjcNftTypes.JOCKEY_SOUL,
  [NftAddr[CjcNftTypes.XMETAL].toLowerCase()]: CjcNftTypes.XMETAL,
  [NftAddr[CjcNftTypes.BODY].toLowerCase()]: CjcNftTypes.BODY,
};

export const CjcTokenList = {
  USDT: { symbol: 'USDT', tokenAddress: '0x5B99dCb3FaEBe7Ba0d1DA231Fd683C6301E29cBE' },
  CJC: { symbol: 'CJC', tokenAddress: '0x854E13F0a08E651873aCe06abd27003B56AD2Fb8' },
};

export const REBUILD_RULES = {
  [CjcNftTypes.BODY]: [
    {
      nftType: CjcNftTypes.JOCKEY_SOUL,
      result: CjcNftTypes.JOCKEY,
      level: 'same',
    },
    {
      nftType: CjcNftTypes.HORSE_SOUL,
      result: CjcNftTypes.HORSE,
      level: 'same',
    },
  ],
  [CjcNftTypes.XMETAL]: [
    {
      nftType: CjcNftTypes.JOCKEY_SOUL,
      result: CjcNftTypes.ITEMS,
      level: 'levelup',
    },
    {
      nftType: CjcNftTypes.HORSE_SOUL,
      result: CjcNftTypes.ITEMS,
      level: 'levelup',
    },
    {
      nftType: CjcNftTypes.ITEM_SOUL,
      result: CjcNftTypes.ITEMS,
      level: 'same',
    },
  ],
  [CjcNftTypes.JOCKEY_SOUL]: [
    {
      nftType: CjcNftTypes.BODY,
      result: CjcNftTypes.JOCKEY,
      level: 'same',
    },
    {
      nftType: CjcNftTypes.XMETAL,
      result: CjcNftTypes.ITEMS,
      level: 'levelup',
    },
  ],
  [CjcNftTypes.HORSE_SOUL]: [
    {
      nftType: CjcNftTypes.BODY,
      result: CjcNftTypes.HORSE,
      level: 'same',
    },
    {
      nftType: CjcNftTypes.XMETAL,
      result: CjcNftTypes.ITEMS,
      level: 'levelup',
    },
  ],
  [CjcNftTypes.ITEM_SOUL]: [
    {
      nftType: CjcNftTypes.XMETAL,
      result: CjcNftTypes.ITEMS,
      level: 'same',
    },
  ],
};

export const REBUILD_INTROS = {
  [CjcNftTypes.BODY]: {
    base: 'Reborn egg add a same rarity jockey or horse soul asset can rebuild a new jockey or horse asset.',
    [CjcNftTypes.JOCKEY_SOUL]:
      'Reborn egg and same rarity jockey soul can rebuild a new jockey asset.Please note that this operation is not reversible.',
    [CjcNftTypes.HORSE_SOUL]:
      'Reborn egg and same rarity horse soul can rebuild a new horse asset.Please note that this operation is not reversible.',
  },
  [CjcNftTypes.XMETAL]: {
    base: 'Rebuild alloy add a same rarity soul asset can rebuild a new item asset.',
    [CjcNftTypes.JOCKEY_SOUL]:
      'Rebuild alloy and same rarity jockey soul can rebuild a new item asset.Please note that this operation is not reversible.',
    [CjcNftTypes.HORSE_SOUL]:
      'Rebuild alloy and same rarity horse soul can rebuild a new item asset.Please note that this operation is not reversible.',
    [CjcNftTypes.ITEM_SOUL]:
      'Rebuild alloy and same rarity item soul can rebuild a new item asset.Please note that this operation is not reversible.',
  },
  [CjcNftTypes.JOCKEY_SOUL]: {
    base: 'Jockey’s soul add a same rarity reborn egg or alloy can rebuild a new jockey asset or a new item asset.',
    [CjcNftTypes.BODY]:
      'Jockey’s soul and same rarity rebuild egg can rebuild a new jockey asset.Please note that this operation is not reversible.',
    [CjcNftTypes.XMETAL]:
      'Jockey’s soul and same rarity rebuild alloy can rebuild a new item asset.Please note that this operation is not reversible.',
  },
  [CjcNftTypes.HORSE_SOUL]: {
    base: 'Horse’s soul add a same rarity reborn egg or alloy can rebuild a new horse asset or a new item asset.',
    [CjcNftTypes.BODY]:
      'Horse’s soul and same rarity rebuild egg can rebuild a new horse asset.Please note that this operation is not reversible.',
    [CjcNftTypes.XMETAL]:
      'Horse’s soul and same rarity rebuild alloy can rebuild a new item asset.Please note that this operation is not reversible.',
  },
  [CjcNftTypes.ITEM_SOUL]: {
    base: 'Item’s soul add a same rarity alloy can rebuild a new item asset.',
    [CjcNftTypes.XMETAL]:
      'Item’s soul and same rarity rebuild alloy can rebuild a new item asset.Please note that this operation is not reversible.',
  },
};

const NftTradeToken = {
  [CjcNftTypes.HORSE]: CjcTokenList['CJC'],
  [CjcNftTypes.BOXES]: CjcTokenList['USDT'],
  [CjcNftTypes.JOCKEY]: CjcTokenList['CJC'],
  [CjcNftTypes.ITEMS]: CjcTokenList['CJC'],
  [CjcNftTypes.SOUL]: CjcTokenList['CJC'],
  [CjcNftTypes.HORSE_SOUL]: CjcTokenList['CJC'],
  [CjcNftTypes.ITEM_SOUL]: CjcTokenList['CJC'],
  [CjcNftTypes.JOCKEY_SOUL]: CjcTokenList['CJC'],
  [CjcNftTypes.XMETAL]: CjcTokenList['CJC'],
  [CjcNftTypes.BODY]: CjcTokenList['CJC'],
  [CjcNftTypes.ALL]: CjcTokenList['CJC'],
};

const NftTypeMap = {
  [CjcNftTypes.HORSE]: ItemType.ERC721,
  [CjcNftTypes.BOXES]: ItemType.ERC1155,
  [CjcNftTypes.JOCKEY]: ItemType.ERC721,
  [CjcNftTypes.ITEMS]: ItemType.ERC721,
  [CjcNftTypes.SOUL]: ItemType.ERC1155,
  [CjcNftTypes.HORSE_SOUL]: ItemType.ERC1155,
  [CjcNftTypes.ITEM_SOUL]: ItemType.ERC1155,
  [CjcNftTypes.JOCKEY_SOUL]: ItemType.ERC1155,
  [CjcNftTypes.XMETAL]: ItemType.ERC1155,
  [CjcNftTypes.BODY]: ItemType.ERC1155,
  [CjcNftTypes.SOUL]: ItemType.ERC1155,
  [CjcNftTypes.ALL]: 0,
};

export const NftProtocolMap = {
  [CjcNftTypes.HORSE]: 'ERC721',
  [CjcNftTypes.BOXES]: 'ERC1155',
  [CjcNftTypes.JOCKEY]: 'ERC721',
  [CjcNftTypes.ITEMS]: 'ERC721',
  [CjcNftTypes.SOUL]: 'ERC1155',
  [CjcNftTypes.HORSE_SOUL]: 'ERC1155',
  [CjcNftTypes.ITEM_SOUL]: 'ERC1155',
  [CjcNftTypes.JOCKEY_SOUL]: 'ERC1155',
  [CjcNftTypes.XMETAL]: 'ERC1155',
  [CjcNftTypes.BODY]: 'ERC1155',
};

export const NFTS_TO_SOULS = {
  [CjcNftTypes.HORSE]: [CjcNftTypes.HORSE_SOUL],
  [CjcNftTypes.ITEMS]: [CjcNftTypes.ITEM_SOUL],
  [CjcNftTypes.JOCKEY]: [CjcNftTypes.JOCKEY_SOUL],
};

export const CROSS_CHAIN_SEAPORT_ADDRESS = '0x00000000006c3852cbef3e08e8df289169ede581';
export const SEAPORT_SWAPPER = '0xB17bb9aeF964577d1eE374cA500b4D54Bcd88d21';
export const CJC_PLAYGROUND_ADDRESS = '0xc0FE491a5B74d1F008daAaC312c6743D6C8fA626';
export const BURNING_CONTRACT_ADDRESS = '0xc872bdb773e471f8a311be5c3dd57dbb1ca5e462';
export const SOUL_STAKER_ADDRESS = '0x3D8b2Fb5F7F5C1854b335bF418154053Ed022878';
export const REBORN_CONTRACT = '0x136682FE6ffA7c7A9221E653E7A39b3BBd596E1c';

export const useAllCjcNftAddr = (): string[] => {
  return Object.values(NftAddr).map((x) => x.toLowerCase());
};
export const useCjcNftAddr = (nftType: CjcNftTypes): string => {
  return NftAddr?.[nftType]?.toLowerCase() || '0x';
};
export const useCjcNftAddrMap = (nftType: CjcNftTypes): string[] => {
  if (nftType === CjcNftTypes.SOUL) {
    return SOULS_BODY_METAL_COLLECTION.map((x) => NftAddr[x]);
  }
  return [NftAddr?.[nftType]?.toLowerCase()] || ['0x'];
};
export const useRawCjcNftAddr = (nftType: CjcNftTypes): string => {
  return NftAddr?.[nftType] || '0x';
};
export const useCjcNftType = (nftType: CjcNftTypes): ItemType => {
  return NftTypeMap[nftType] || ItemType.ERC721;
};
export const getCjcNftTypeByContractAddr = (contractAddr: string): CjcNftTypes | null => {
  if (!contractAddr) {
    return null;
  }
  const isSoul = SOULS_COLLECTION.find((soul) =>
    isSameAddress(NftAddr[soul], contractAddr),
  );
  if (isSoul) {
    return isSoul;
  }
  return ContranctToNftType[contractAddr.toLowerCase()] || CjcNftTypes.HORSE;
};
export const useCjcNftTradeToken = (
  nftType: CjcNftTypes,
): { symbol: string; tokenAddress: string } => {
  return NftTradeToken[nftType];
};
