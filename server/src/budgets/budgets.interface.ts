import { Services } from '@expense-manager/schema';

export type AmountValue = { amount: number; currency: string };

export interface AmountValueWithTransactionIds extends AmountValue {
  transactionIds: string[];
}

export interface AmountValueWithTransactions extends AmountValue {
  transactions: Services.Transactions.Transaction[];
}

export interface GetBudgetOverviewWithTransactions {
  overview: Services.Budgets.BudgetOverview;
  transactions: Services.Transactions.Transaction[];
}
