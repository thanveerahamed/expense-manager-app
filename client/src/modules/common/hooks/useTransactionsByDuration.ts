import { useCallback, useEffect, useState } from 'react';

import { Services } from '@expense-manager/schema';

import { Dayjs } from '../../../common/helpers/dayJs';
import { getTransactionsByDuration } from '../../../providers';

export interface Props {
  startDate?: Dayjs;
  endDate?: Dayjs;
  labelId?: string;
}

export const useTransactionsByDuration = ({
  startDate,
  endDate,
  labelId,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<
    Services.Transactions.Transaction[]
  >([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  const fetchTransactions = useCallback(async () => {
    if (startDate === undefined || endDate === undefined) {
      return;
    }

    try {
      const response = await getTransactionsByDuration({
        startDate,
        endDate,
        labelId,
      });
      setTransactions(response);
    } catch (error: any) {
      setError(error);
    }
  }, [startDate, endDate, labelId]);

  const reload = () => {
    (async () => {
      setIsLoading(true);
      try {
        await fetchTransactions();
      } catch (e: any) {
        setError(new Error(e));
      }
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, labelId]);

  return {
    isLoading,
    error,
    reload,
    transactions,
  };
};
