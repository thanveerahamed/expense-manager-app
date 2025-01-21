import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {UserDemographics} from '../../common/types/user';

const initialState: {
    demographics?: UserDemographics;
    isLoading: boolean;
    error?: Error;
} = {
    demographics: undefined,
    isLoading: true,
    error: undefined,
};

export const userSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        updateUserDemographics: (
            state,
            action: PayloadAction<UserDemographics | undefined>,
        ) => {
            state.demographics = action.payload;
        },
        updateLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        updateError: (state, action: PayloadAction<Error | undefined>) => {
            state.error = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {updateUserDemographics, updateLoading, updateError} =
    userSlice.actions;
