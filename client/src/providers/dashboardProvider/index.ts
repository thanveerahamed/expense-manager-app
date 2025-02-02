import { Services, Shared } from '@expense-manager/schema';

import { LabelWithAmount } from '../../common/types/labels';
import { apiGet, apiPost } from '../common';
import { HOST_URL } from '../common/constants';

const dashboardUrl = `${HOST_URL}/dashboard`;

export interface GetDashboardDataResponse {
  isAccountSetup: boolean;
  isRequisitionExpired?: boolean;
  isRequisitionFailed?: boolean;
  transactions: Services.Transactions.Transaction[];
  budgetOverviews: Services.Budgets.BudgetOverview[];
  balance: Shared.Money.Money;
  lastSyncTransactionsJob?: Services.SyncTransactionsJobs.Entity;
}

export const getDashboardData = async (): Promise<GetDashboardDataResponse> => {
  const getDashboardDataUrl = `${dashboardUrl}`;
  return apiGet<GetDashboardDataResponse>(getDashboardDataUrl);
};

export const getDashboardLabelsData = async (): Promise<LabelWithAmount[]> => {
  const getDashboardLabelsDataUrl = `${dashboardUrl}/labels`;
  return apiGet<LabelWithAmount[]>(getDashboardLabelsDataUrl);
};

export const getDashboardNewTransactions = async (): Promise<
  Services.Transactions.Transaction[]
> => {
  const getNewTransactions = `${dashboardUrl}/new-transactions`;
  return apiGet<Services.Transactions.Transaction[]>(getNewTransactions);
};

export const setTransactionToOld = async (transactionId: string): Promise<void> => {
  const setTransactionToOldUrl = `${dashboardUrl}/set-transaction-old`;
  return apiPost(setTransactionToOldUrl, { transactionId });
};
