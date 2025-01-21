import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState: {
    nordigen: {
        isSetup: boolean;
        isExpired?: boolean;
        authorizationStatus?: {
            success?: boolean;
            errorMessage?: string;
        };
    };
} = {
    nordigen: {
        isSetup: true,
    },
};

export const connectionsSlice = createSlice({
    name: 'connections',
    initialState,
    reducers: {
        setNordigenConnectionSetup: (state, action: PayloadAction<boolean>) => {
            state.nordigen.isSetup = action.payload;
        },
        setNordigenConnectionExpired: (state, action: PayloadAction<boolean>) => {
            state.nordigen.isExpired = action.payload;
        },
        updateAuthorizationInformation: (
            state,
            action: PayloadAction<{ success?: boolean; errorMessage?: string }>,
        ) => {
            state.nordigen.authorizationStatus = action.payload;
            state.nordigen.isSetup = true;
        },
        resetAuthorizationInformation: (state) => {
            state.nordigen.authorizationStatus = undefined;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    setNordigenConnectionSetup,
    setNordigenConnectionExpired,
    updateAuthorizationInformation,
    resetAuthorizationInformation,
} = connectionsSlice.actions;
