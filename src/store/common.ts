import { CaseReducer } from '@reduxjs/toolkit';

export type LoadingState = 'pending' | 'idle' | 'uninitialized';

export const pendingReducer: CaseReducer = (state, { meta }) => {
  if (state.loading !== 'pending') {
    state.loading = 'pending';
    state.currentRequestId = meta.requestId;
  }
};

export const errorReducer: CaseReducer = (state, { meta, error, payload }) => {
  if (state.loading === 'pending' && state.currentRequestId === meta.requestId) {
    state.loading = 'idle';
    state.error = payload;
    state.currentRequestId = undefined;
  }

  if (payload?.message) {
    throw new Error(payload.message);
  }
};

export const resetReducer: CaseReducer = (state) => {
  state.loading = 'uninitialized';
  state.data = undefined;
  state.currentRequestId = undefined;
};
