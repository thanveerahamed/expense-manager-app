import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getTransactions } from '../../../providers';
import {
  setError,
  setFirstLoadComplete,
  setHasMore,
  setLoading,
  setNextPageToken,
  setTransactions,
  setViewMoreLoading,
} from '../../../store/reducers/transactionSlice';
import { RootState, useAppDispatch } from '../../../store/store';

export const useTransactions = () => {
  const dispatch = useAppDispatch();

  const {
    user: { demographics },
    transaction: { transactions, nextPageToken, firstLoadComplete },
  } = useSelector((state: RootState) => state);

  const makeRequest = async (): Promise<void> => {
    try {
      const transactionsResponse = await getTransactions({ nextPageToken });
      dispatch(
        setTransactions([
          ...transactions,
          ...transactionsResponse.transactions,
        ]),
      );

      if (transactionsResponse.nextPageToken === undefined) {
        dispatch(setNextPageToken(undefined));
        dispatch(setHasMore(false));
      } else {
        dispatch(setNextPageToken(transactionsResponse.nextPageToken));
      }
    } catch (error: any) {
      dispatch(
        setError({
          code: 'ERR_FAILED',
          details: error.message,
        }),
      );
    }
  };

  const getNextPageData = () => {
    (async () => {
      dispatch(setViewMoreLoading(true));
      await makeRequest();
      dispatch(setViewMoreLoading(false));
    })();
  };

  useEffect(() => {
    if (demographics === undefined || firstLoadComplete) {
      return;
    }

    (async () => {
      dispatch(setLoading(true));
      await makeRequest();
      dispatch(setLoading(false));
      dispatch(setFirstLoadComplete(true));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demographics]);

  return {
    getNextPageData,
  };
};
