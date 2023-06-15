import { createSlice } from '@reduxjs/toolkit';

// import {CHAINID_MAP} from 'web3/wallet/chains'
import { UserData } from '@/hooks/queries/useAuthApis';

import { IStoreState } from '.';

export const { actions, reducer } = createSlice({
  name: 'user',
  initialState: {
    clkAdded: {} as Record<number, boolean>,
    userInfo: null,
    electricRecord: [] as Record<string, string>[],
  },
  reducers: {
    updateClkAdded: (
      state,
      { payload }: { payload: { chainId: number; status: boolean } },
    ) => {
      state.clkAdded[payload.chainId] = payload.status;
    },
    updateUserInfo: (state, { payload }) => {
      state.userInfo = payload;
    },
    updateElectricRecord: (state, { payload }) => {
      state.electricRecord = [...(state.electricRecord || []), payload];
    },
    clearElectricRecord: (state, { payload }) => {
      state.electricRecord = [];
    },
    deleteElectricRecord: (state, { payload }) => {
      console.log(payload, 'check payload')
      state.electricRecord = state.electricRecord.filter((x) => x.sign !== payload);
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

export const updateClkAdded = actions.updateClkAdded;
export const selectClkAdded = (state: IStoreState) => state.user.clkAdded;

export const updateUserInfo = actions.updateUserInfo;
export const selectUserInfo = (state: IStoreState): UserData | null =>
  state.user.userInfo;

export const updateElectricRecord = actions.updateElectricRecord;
export const clearElectricRecord = actions.clearElectricRecord;
export const deleteElectricRecord = actions.deleteElectricRecord;
export const selectElectricRecord = (state: IStoreState) => state.user.electricRecord;
