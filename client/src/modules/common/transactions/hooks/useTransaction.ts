import { useEffect, useState } from 'react';

import { Services } from '@expense-manager/schema';

import { getTransactionById } from '../../../../providers';

export const useTransaction = (transactionId?: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [transaction, setTransaction] = useState<
    Services.Transactions.Transaction | undefined
  >(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (transactionId === undefined) {
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const value = await getTransactionById({ transactionId });
        setTransaction(value);
      } catch (error: any) {
        setError(error);
      }

      setLoading(false);
    })();
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    transaction,
    error,
    setTransaction,
  };
};
