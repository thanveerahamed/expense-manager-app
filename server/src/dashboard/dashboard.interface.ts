import { Services, Shared } from '@expense-manager/schema';

export interface GetDashboardDataResponse {
  isAccountSetup: boolean;
  isRequisitionExpired?: boolean;
  isRequisitionFailed?: boolean;
  transactions: Services.Transactions.Transaction[];
  budgetOverviews: Services.Budgets.BudgetOverview[];
  balance: Shared.Money.Money;
  lastSyncTransactionsJob?: Services.SyncTransactionsJobs.Entity;
}
