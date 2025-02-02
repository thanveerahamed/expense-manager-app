import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderedCategory } from '../../common/types';
import { ApplicationError } from '../../common/types/error';

const initialState: {
  categories: OrderedCategory[];
  isLoading: boolean;
  error?: ApplicationError;
} = {
  categories: [],
  isLoading: true,
  error: undefined,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<OrderedCategory[]>) => {
      state.categories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<ApplicationError | undefined>) => {
      state.error = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCategories, setLoading, setError } = categorySlice.actions;
