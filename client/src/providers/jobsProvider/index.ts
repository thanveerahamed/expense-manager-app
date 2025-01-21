import {Services} from '@expense-manager/schema';

import {apiGet} from '../common';
import {HOST_URL} from '../common/constants';

const jobsUrl = `${HOST_URL}/jobs`;

export const getSyncTransactionsJobs = async (): Promise<
    Services.SyncTransactionsJobs.Entity[]
> => {
    const getSyncTransactionJobs = `${jobsUrl}/syncTransactions`;
    return apiGet<Services.SyncTransactionsJobs.Entity[]>(getSyncTransactionJobs);
};

export const createSyncTransactionsJob = async (): Promise<{
    success: boolean;
}> => {
    const createSyncTransactionJobs = `${jobsUrl}/createSyncTransactionsJob`;
    return apiGet<{ success: boolean }>(createSyncTransactionJobs);
};
