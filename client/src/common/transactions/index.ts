import {Collections, Services} from '@expense-manager/schema';

export const getTransactionName = (
    transaction: Collections.Transactions.Entity,
) => {
    return transaction.creditorName === undefined
        ? transaction.debtorName === undefined
            ? transaction.proprietaryBankTransactionCode
            : transaction.debtorName
        : transaction.creditorName;
};

export const isExcludedCategoryTransaction = (
    transaction: Services.Transactions.Transaction,
): boolean =>
    ['Transfers', 'Savings', 'Exclude'].includes(transaction.category.name);
