import { useEffect, useState } from 'react';

import { Services } from '@expense-manager/schema';

import { getSyncTransactionsJobs } from '../../../providers/jobsProvider';

export const useSyncTransactionJobs = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jobs, setJobs] = useState<Services.SyncTransactionsJobs.Entity[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  const reloadJobs = async () => {
    setIsLoading(true);
    try {
      const response = await getSyncTransactionsJobs();
      setJobs(response);
    } catch (e: any) {
      setError(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    reloadJobs();
  }, []);

  return {
    isLoading,
    jobs,
    error,
    reloadJobs,
  };
};
