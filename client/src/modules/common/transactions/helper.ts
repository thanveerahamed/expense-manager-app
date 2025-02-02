import { Services } from '@expense-manager/schema';

import { isExcludedCategoryTransaction } from '../../../common/transactions';

export interface TransactionsByDate {
  date: string;
  transactions: Services.Transactions.Transaction[];
  amountSpent: number;
  currency: string;
}

export const getTransactionsByDate = (
  transactions: Services.Transactions.Transaction[],
): TransactionsByDate[] => {
  return transactions
    .reduce(
      (
        previousValue: TransactionsByDate[],
        transaction: Services.Transactions.Transaction,
      ): TransactionsByDate[] => {
        const previousTransactionsByDate = previousValue.find(
          (value) => value.date === transaction.bookingDate,
        );

        if (previousTransactionsByDate === undefined) {
          return [
            ...previousValue,
            {
              date: transaction.bookingDate,
              transactions: [transaction],
              amountSpent: isExcludedCategoryTransaction(transaction)
                ? 0
                : Number(transaction.amount),
              currency: transaction.currency,
            },
          ];
        } else {
          const newTransactionsByDate: TransactionsByDate = {
            date: previousTransactionsByDate.date,
            transactions: [
              ...previousTransactionsByDate.transactions,
              transaction,
            ],
            amountSpent: isExcludedCategoryTransaction(transaction)
              ? previousTransactionsByDate.amountSpent
              : previousTransactionsByDate.amountSpent +
                Number(transaction.amount),
            currency: transaction.currency,
          };
          return [
            ...previousValue.filter(
              (value) => value.date !== transaction.bookingDate,
            ),
            newTransactionsByDate,
          ];
        }
      },
      [],
    )
    .sort((firstTransaction, secondTransaction) => {
      return firstTransaction.date > secondTransaction.date ? -1 : 1;
    });
};
