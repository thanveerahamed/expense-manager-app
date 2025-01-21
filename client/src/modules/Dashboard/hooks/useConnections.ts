import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {setRequisitionToFailed} from '../../../providers/bankingProvider';
import {RootState} from '../../../store/store';

export const useConnections = () => {
    const {
        nordigen: {authorizationStatus},
    } = useSelector((state: RootState) => state.connections);
    const [showConnectionModal, setShowConnectionModal] =
        useState<boolean>(false);

    const closeModal = () => setShowConnectionModal(false);

    useEffect(() => {
        if (authorizationStatus === undefined) {
            return;
        }

        if (authorizationStatus.success === false) {
            setRequisitionToFailed().then(() => {
                console.log('Status updated to failed.');
            });
        }

        setShowConnectionModal(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        connectionSuccess: authorizationStatus?.success,
        connectionErrorMessage: authorizationStatus?.errorMessage,
        showConnectionModal,
        closeModal,
    };
};
