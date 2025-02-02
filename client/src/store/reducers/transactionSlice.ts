import { Services } from '@expense-manager/schema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ApplicationError } from '../../common/types/error';

const initialState: {
  transactions: Services.Transactions.Transaction[];
  isLoading: boolean;
  error?: ApplicationError;
  nextPageToken: string | undefined;
  firstLoadComplete: boolean;
  hasMore: boolean;
  selectedTransaction: Services.Transactions.Transaction | undefined;
  viewMoreLoading: boolean;
  refreshLoading: boolean;
} = {
  transactions: [],
  isLoading: true,
  error: undefined,
  nextPageToken: undefined,
  firstLoadComplete: false,
  hasMore: true,
  selectedTransaction: undefined,
  viewMoreLoading: false,
  refreshLoading: false,
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (
      state,
      action: PayloadAction<Services.Transactions.Transaction[]>,
    ) => {
      state.transactions = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<ApplicationError | undefined>) => {
      state.error = action.payload;
    },
    setNextPageToken: (state, action: PayloadAction<string | undefined>) => {
      state.nextPageToken = action.payload;
    },
    setFirstLoadComplete: (state, action: PayloadAction<boolean>) => {
      state.firstLoadComplete = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setSelectedTransaction: (
      state,
      action: PayloadAction<Services.Transactions.Transaction | undefined>,
    ) => {
      state.selectedTransaction = action.payload;
    },
    setViewMoreLoading: (state, action: PayloadAction<boolean>) => {
      state.viewMoreLoading = action.payload;
    },
    setRefreshLoading: (state, action: PayloadAction<boolean>) => {
      state.refreshLoading = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setTransactions,
  setLoading,
  setError,
  setFirstLoadComplete,
  setNextPageToken,
  setHasMore,
  setSelectedTransaction,
  setViewMoreLoading,
  setRefreshLoading,
} = transactionSlice.actions;
