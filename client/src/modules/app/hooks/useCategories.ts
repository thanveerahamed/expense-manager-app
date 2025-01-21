import {useEffect} from 'react';

import {getCategories} from '../../../providers';
import {setCategories, setError, setLoading,} from '../../../store/reducers/categorySlice';
import {useAppDispatch} from '../../../store/store';

export const useCategories = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            try {
                const categories = await getCategories();
                dispatch(setCategories(categories));
            } catch (e: any) {
                console.log(e);
                dispatch(
                    setError({
                        code: 'ERR_FAILED',
                        details: 'Unable to fetch categories',
                    }),
                );
            }

            dispatch(setLoading(false));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
