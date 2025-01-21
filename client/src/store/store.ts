import {useDispatch} from 'react-redux';

import {budgetSlice} from './reducers/budgetSlice';
import {categorySlice} from './reducers/categorySlice';
import {connectionsSlice} from './reducers/connectionsSlice';
import {transactionSlice} from './reducers/transactionSlice';
import {userSlice} from './reducers/userSlice';
import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        category: categorySlice.reducer,
        transaction: transactionSlice.reducer,
        budget: budgetSlice.reducer,
        connections: connectionsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export const state = store.getState();

export default store;
