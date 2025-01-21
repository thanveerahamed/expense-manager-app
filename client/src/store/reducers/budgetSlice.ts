import {Services} from '@expense-manager/schema';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {ApplicationError} from '../../common/types/error';

const initialState: {
    budgetOverviews: Services.Budgets.BudgetOverview[];
    isLoading: boolean;
    error?: ApplicationError;
} = {
    budgetOverviews: [],
    isLoading: true,
    error: undefined,
};

export const budgetSlice = createSlice({
    name: 'budget',
    initialState,
    reducers: {
        setBudgetOverviews: (
            state,
            action: PayloadAction<Services.Budgets.BudgetOverview[]>,
        ) => {
            state.budgetOverviews = action.payload;
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
export const {setBudgetOverviews, setLoading, setError} = budgetSlice.actions;
