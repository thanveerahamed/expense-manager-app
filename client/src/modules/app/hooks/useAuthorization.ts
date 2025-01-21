import {useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useSelector} from 'react-redux';

import {auth} from '../../../common/firebase/firebase';
import {getUserDemographics} from '../../../providers';
import {updateError, updateLoading, updateUserDemographics,} from '../../../store/reducers/userSlice';
import {RootState, useAppDispatch} from '../../../store/store';

export const useAuthorization = () => {
    const dispatch = useAppDispatch();

    const {demographics, isLoading, error} = useSelector(
        (state: RootState) => state.user,
    );

    const [user, loading, authError] = useAuthState(auth);

    useEffect(() => {
        (async () => {
            dispatch(
                updateUserDemographics(
                    user === undefined || user === null
                        ? undefined
                        : await getUserDemographics(user.uid),
                ),
            );
            dispatch(updateLoading(loading));
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, loading]);

    useEffect(() => {
        dispatch(updateError(authError));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authError]);

    return {demographics, loading: isLoading, error};
};
