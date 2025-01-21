import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {getTransactionsUntil} from '../../../../providers';
import {setRefreshLoading, setTransactions,} from '../../../../store/reducers/transactionSlice';
import {RootState, useAppDispatch} from '../../../../store/store';

export const useTransactionUpdate = () => {
    const dispatch = useAppDispatch();
    const {nextPageToken} = useSelector(
        (state: RootState) => state.transaction,
    );

    const refreshLoadedTransactions = () => {
        (async () => {
            if (nextPageToken !== undefined) {
                dispatch(setRefreshLoading(true));
                try {
                    const transactions = await getTransactionsUntil({
                        transactionId: nextPageToken,
                    });
                    dispatch(setTransactions(transactions));
                } catch (e: any) {
                    toast('Some error occurred. Unable to reload transactions.', {
                        type: 'error',
                    });
                }
                dispatch(setRefreshLoading(false));
            }
        })();
    };

    return {
        refreshLoadedTransactions,
    };
};
