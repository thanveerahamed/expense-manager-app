import {useEffect} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';

import {auth} from '../../../common/firebase/firebase';
import {getUserDemographics} from '../../../providers';
import {updateError, updateLoading, updateUserDemographics,} from '../../../store/reducers/userSlice';
import {useAppDispatch} from '../../../store/store';

export const useGetUserOnce = () => {
    const dispatch = useAppDispatch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user !== undefined && user !== null) {
            (async () => {
                try {
                    dispatch(updateUserDemographics(await getUserDemographics(user.uid)));
                } catch (err: any) {
                    dispatch(updateError(new Error(err)));
                }
                dispatch(updateLoading(false));
            })();
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error !== undefined) {
            dispatch(updateError(error));
            dispatch(updateLoading(false));
        }
    }, [dispatch, error]);

    return {};
};
