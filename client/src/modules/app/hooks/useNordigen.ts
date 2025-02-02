import { useEffect } from 'react';

import {
  deleteNordigenReference,
  getNordigenReference,
} from '../../../common/storage';
import { updateAuthorizationInformation } from '../../../store/reducers/connectionsSlice';
import { useAppDispatch } from '../../../store/store';

const isAuthorizationReturnUrl = () =>
  window.location.pathname === '/connection-setup/bank-selector/result';

export const useNordigen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedReference = getNordigenReference();

    if (savedReference === undefined) {
      return;
    }

    if (isAuthorizationReturnUrl()) {
      const urlParams = new URLSearchParams(window.location.search);
      const referenceFromUrl = urlParams.get('ref');

      if (referenceFromUrl === null || referenceFromUrl !== savedReference) {
        deleteNordigenReference();
        return;
      }

      const error = urlParams.get('error');
      const details = urlParams.get('details');

      dispatch(
        updateAuthorizationInformation({
          errorMessage:
            error !== null && details !== null
              ? details.replace('+', ' ')
              : undefined,
          success: error === null,
        }),
      );

      deleteNordigenReference();
    }

    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
