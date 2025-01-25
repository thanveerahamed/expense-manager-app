import { Collections } from "@expense-manager/schema";

export const getTransactionType = (
  transaction:
    | Collections.Transactions.Entity
    | Collections.Transactions.BankingAPITransaction
) => {
  return Number(transaction.transactionAmount.amount) > 0
    ? Collections.Transactions.TransactionType.Credit
    : Collections.Transactions.TransactionType.Debit;
};

export const getTransactionName = (
  transaction:
    | Collections.Transactions.Entity
    | Collections.Transactions.BankingAPITransaction
) => {
  return transaction.creditorName === undefined
    ? transaction.debtorName === undefined
      ? transaction.proprietaryBankTransactionCode
      : transaction.debtorName
    : transaction.creditorName;
};
