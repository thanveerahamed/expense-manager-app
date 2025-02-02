import { useEffect, useState } from 'react';

import { useConnections } from './useConnections';
import { Services, Shared } from '@expense-manager/schema';

import { getDashboardData } from '../../../providers';
import {
  setNordigenConnectionExpired,
  setNordigenConnectionSetup,
} from '../../../store/reducers/connectionsSlice';
import { useAppDispatch } from '../../../store/store';

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { showConnectionModal } = useConnections();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<
    Services.Transactions.Transaction[]
  >([]);
  const [overviews, setOverviews] = useState<Services.Budgets.BudgetOverview[]>(
    [],
  );
  const [accountBalance, setAccountBalance] = useState<Shared.Money.Money>({
    currency: 'EUR',
    amount: '0.00',
  });
  const [lastSyncTransactionJob, setLastSyncTransactionJob] = useState<
    Services.SyncTransactionsJobs.Entity | undefined
  >(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const reloadJobs = () => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await getDashboardData();

        if (response.isAccountSetup === false) {
          dispatch(setNordigenConnectionSetup(false));

          if (showConnectionModal) {
            //navigate("/connection-setup/result");
          } else {
            //navigate("/connection-setup/bank-selector");
          }
        }

        if (response.isRequisitionExpired === true) {
          dispatch(setNordigenConnectionExpired(false));
        }

        setTransactions(response.transactions);
        setOverviews(response.budgetOverviews);
        setAccountBalance(response.balance);
        setLastSyncTransactionJob(response.lastSyncTransactionsJob);
      } catch (e: any) {
        setError(e);
      }
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    reloadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoading,
    transactions,
    overviews,
    error,
    reloadJobs,
    accountBalance,
    lastSyncTransactionJob,
  };
};
