import {useEffect} from 'react';

import {getBudgetOverviews} from '../../../providers';
import {setBudgetOverviews, setError, setLoading,} from '../../../store/reducers/budgetSlice';
import {useAppDispatch} from '../../../store/store';

export const useBudgetOverviews = () => {
    const dispatch = useAppDispatch();

    const refreshBudgetOverViews = () => {
        (async () => {
            dispatch(setLoading(true));
            try {
                const response = await getBudgetOverviews();
                dispatch(setBudgetOverviews(response.budgets));
            } catch (error: any) {
                console.error(error);
                dispatch(
                    setError({
                        code: 'error',
                        details: 'getBudgetOverviews threw an error',
                    }),
                );
            }
            dispatch(setLoading(false));
        })();
    };

    useEffect(() => {
        refreshBudgetOverViews();
        // eslint-disable-next-line  react-hooks/exhaustive-deps
    }, []);

    return {
        refreshBudgetOverViews,
    };
};
