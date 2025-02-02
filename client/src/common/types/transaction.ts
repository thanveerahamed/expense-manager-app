import { Collections } from '@expense-manager/schema';

export interface GetTransactionsResponse {
  transactions: Collections.Transactions.Entity[];
  nextPageToken?: string;
}
