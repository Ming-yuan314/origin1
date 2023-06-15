import { createSlice, SerializedError } from '@reduxjs/toolkit';
import Lockr from 'lockr';

import { CHAINS } from '../web3/constants';
import { IStoreState } from '.';
import { LoadingState } from './common';

export interface PendingStatus {
  pending: boolean;
  success?: boolean;
  pendingText?: string;
  pendingIntro?: string;
  txHash?: any;
}

export const { actions, reducer } = createSlice({
  name: 'globalConfig',
  initialState: {
    connectWalletType: Lockr.get('ethConnectType'),
    currentChainType: null,
    walletConnected: false,
    desiredChainId: Lockr.get<number>('lastDesiredChainId') || +Object.keys(CHAINS)[0],
    requestingConnect: false,
    scrollTopTrigger: 0,

    lastEthConnectType: Lockr.get('ethConnectType'),

    ethModalVisible: false,
    vtimsModalVisible: false,
    accountModalVisible: false,
    txStatusModalVisible: false,
    txStatusParams: { pending: false } as PendingStatus,

    leftClinkBorrow: 0,

    blockNumber: null,
    blockTime: null,

    loading: 'uninitialized' as LoadingState,
    error: undefined as SerializedError | undefined,

    pendingTxs: [],
    pendingEndResult: 0,

    selelctTokenVisible: false,

    sideBarWidth: (Lockr.get('sidebarCurrentWidth') as number) || 240,
  },
  reducers: {
    updateWalletType: (state, { payload }) => {
      state.connectWalletType = payload;
    },
    updateWalletStatus: (state, { payload }) => {
      state.walletConnected = payload;
    },
    updateDesiredChainId: (state, { payload }) => {
      state.desiredChainId = payload;
    },
    updateRequestingConnect: (state, { payload }) => {
      state.requestingConnect = payload;
    },
    updateScrollTopTrigger: (state, { payload }) => {
      state.scrollTopTrigger = payload;
    },

    updateEthModalVisible: (state, { payload }) => {
      state.ethModalVisible = payload;
    },
    updateAccountModalVisible: (state, { payload }) => {
      state.accountModalVisible = payload;
    },
    updateTxStatusModalVisible: (state, { payload }) => {
      state.txStatusModalVisible = payload;
    },
    updateTxStatusParams: (state, { payload }) => {
      state.txStatusParams = payload;
    },

    updateLastEthConnectType: (state, { payload }) => {
      state.lastEthConnectType = payload;
    },
    updateBlockNumber: (state, { payload }) => {
      state.blockNumber = payload;
    },
    updateBlockTime: (state, { payload }) => {
      state.blockTime = payload;
    },

    updatePendingTxs: (state, { payload }) => {
      state.pendingTxs = payload;
    },
    updatePendingEndResult: (state, { payload }) => {
      state.pendingEndResult = payload;
    },

    updateSelectTokenVisible: (state, { payload }) => {
      state.selelctTokenVisible = payload;
    },
    // left clink borrow of current account
    updateLeftClinkBorrow: (state, { payload }) => {
      state.leftClinkBorrow = payload;
    },

    updateSideBarWidth: (state, { payload }) => {
      state.sideBarWidth = payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchBanners.rejected, errorReducer)
  //     .addCase(fetchBanners.pending, pendingReducer)
  //     .addCase(fetchBanners.fulfilled, (state, { payload }) => {
  //       state.banners = payload
  //       state.loading = 'idle'
  //     })
  // },
});

export const updateWalletType = actions.updateWalletType;
export const selectWalletType = (state: IStoreState) =>
  state.globalConfig.connectWalletType;

export const updateWalletStatus = actions.updateWalletStatus;
export const selectWalletConnectStatus = (state: IStoreState) =>
  state.globalConfig.walletConnected;

export const updateDesiredChainId = actions.updateDesiredChainId;
export const selectChainType = (state: IStoreState) =>
  state.globalConfig.currentChainType;
export const selectDesiredChainId = (state: IStoreState): number =>
  state.globalConfig.desiredChainId;

export const updateRequestingConnect = actions.updateRequestingConnect;
export const selectRequestingConnect = (state: IStoreState) =>
  state.globalConfig.requestingConnect;

export const updateLastEthConnectType = actions.updateLastEthConnectType;
export const selectLastEthConnectType = (state: IStoreState) =>
  state.globalConfig.lastEthConnectType;

export const updateEthModalVisible = actions.updateEthModalVisible;
export const selectEthModalVisible = (state: IStoreState) =>
  state.globalConfig.ethModalVisible;

export const updateAccountModalVisible = actions.updateAccountModalVisible;
export const selectAccountModalVisible = (state: IStoreState) =>
  state.globalConfig.accountModalVisible;

export const updateTxStatusModalVisible = actions.updateTxStatusModalVisible;
export const selectTxStatusModalVisible = (state: IStoreState) =>
  state.globalConfig.txStatusModalVisible;
export const updateTxStatusParams = actions.updateTxStatusParams;
export const selectTxStatusParams = (state: IStoreState) =>
  state.globalConfig.txStatusParams;

export const updateBlockNumber = actions.updateBlockNumber;
export const selectBlockNumber = (state: IStoreState) => state.globalConfig.blockNumber;

export const updateBlockTime = actions.updateBlockTime;
export const selectBlockTime = (state: IStoreState) => state.globalConfig.blockTime;

export const updatePendingTxs = actions.updatePendingTxs;
export const selectPendingTxs = (state: IStoreState) => state.globalConfig.pendingTxs;

export const updatePendingEndResult = actions.updatePendingEndResult;
export const selectPendingEndResult = (state: IStoreState) =>
  state.globalConfig.pendingEndResult;

export const updateSelectTokenVisible = actions.updateSelectTokenVisible;
export const selectSelectTokenVisible = (state: IStoreState) =>
  state.globalConfig.selelctTokenVisible;

export const updateLeftClinkBorrow = actions.updateLeftClinkBorrow;
export const selectLeftClinkBorrow = (state: IStoreState) =>
  state.globalConfig.leftClinkBorrow;

export const updateScrollTopTrigger = actions.updateScrollTopTrigger;
export const selectScrollTopTrigger = (state: IStoreState) =>
  state.globalConfig.scrollTopTrigger;

export const updateSideBarWidth = actions.updateSideBarWidth;
export const selectSideBarWidth = (state: IStoreState): number =>
  state.globalConfig.sideBarWidth;

// export const selectBannersLoadingStatus = (state: IStoreState): LoadingState => state.indexPage.loading

// export const useIndexPageStore = () => {
//     const dispatch = useTypedDispatch()
//     const banners = useSelector(selectBanners)
//     const loadingStatus = useSelector(selectBannersLoadingStatus)

//     useEffect(() => {
//         loadingStatus === 'uninitialized' && dispatch<any>(fetchBanners('v-node'))
//     }, [loadingStatus])

//     return {
//         indexBanners: banners,
//         indexBannerLoadingStatus: loadingStatus,
//     }
// }
