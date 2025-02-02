import { Collections } from '@expense-manager/schema';
import {
  getTransactionDocumentsForTheMonth,
  getTransactionDocumentsWithMatchingCategories,
  isExcludedCategory,
  makeTransaction,
} from '../transactions';
import moment from 'moment';
import {
  AmountValueWithTransactions,
  GetBudgetOverviewWithTransactions,
} from '../../budgets/budgets.interface';
import { makeResponse } from './index';

const makeTransactionsForCategoriesAndLabels = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  month: Collections.Months.Entity,
  budgetId: string,
): Promise<GetBudgetOverviewWithTransactions> => {
  const transactionsDocuments =
    await getTransactionDocumentsWithMatchingCategories(budget, userId, month);

  const budgetLabelIds = budget.labels.map((label) => label.id);
  const { transactions, ...amountValue } = transactionsDocuments.reduce(
    (
      previousValue: AmountValueWithTransactions,
      currentDocument,
    ): AmountValueWithTransactions => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      // If budget does not have labels, then include all the transactions
      // inside the expense.
      const labelMatch =
        budgetLabelIds.length > 0
          ? transaction.labels !== undefined &&
            transaction.labels.filter((label) =>
              budgetLabelIds.includes(label.id),
            ).length > 0
          : true;

      if (labelMatch === false) {
        return previousValue;
      }

      const currentAmountValue = transaction.transactionAmount;
      const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

      return {
        amount: previousValue.amount + transactionAmount,
        currency: currentAmountValue.currency,
        transactions: [
          ...previousValue.transactions,
          makeTransaction(transaction),
        ],
      };
    },
    { amount: 0, currency: '', transactions: [] },
  );

  return {
    overview: makeResponse(budget, amountValue, budgetId),
    transactions,
  };
};

const makeTransactionsForCategoriesOrLabels = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  month: Collections.Months.Entity,
  budgetId: string,
): Promise<GetBudgetOverviewWithTransactions> => {
  const transactionsDocuments = await getTransactionDocumentsForTheMonth(
    userId,
    month,
  );

  const budgetLabelIds = budget.labels.map((label) => label.id);
  const budgetCategoryIds = budget.categories.map((category) => category.id);

  const { transactions, ...amountValue } = transactionsDocuments.reduce(
    (
      previousValue: AmountValueWithTransactions,
      currentDocument,
    ): AmountValueWithTransactions => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      const categoryMatched = budgetCategoryIds.includes(
        transaction.category.id,
      );
      const labelsMatched =
        transaction.labels !== undefined &&
        transaction.labels.filter((label) => budgetLabelIds.includes(label.id))
          .length > 0;

      if (categoryMatched || labelsMatched) {
        const currentAmountValue = transaction.transactionAmount;
        const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

        return {
          amount: previousValue.amount + transactionAmount,
          currency: currentAmountValue.currency,
          transactions: [
            ...previousValue.transactions,
            makeTransaction(transaction),
          ],
        };
      }

      return previousValue;
    },
    { amount: 0, currency: '', transactions: [] },
  );

  return {
    overview: makeResponse(budget, amountValue, budgetId),
    transactions,
  };
};

const makeTransactionsForCategoriesOnly = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  month: Collections.Months.Entity,
  budgetId: string,
): Promise<GetBudgetOverviewWithTransactions> => {
  const transactionsDocuments =
    await getTransactionDocumentsWithMatchingCategories(budget, userId, month);
  const { transactions, ...amountValue } = transactionsDocuments.reduce(
    (
      previousValue: AmountValueWithTransactions,
      currentDocument,
    ): AmountValueWithTransactions => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      const currentAmountValue = transaction.transactionAmount;
      const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

      return {
        amount: previousValue.amount + transactionAmount,
        currency: currentAmountValue.currency,
        transactions: [
          ...previousValue.transactions,
          makeTransaction(transaction),
        ],
      };
    },
    { amount: 0, currency: '', transactions: [] },
  );

  return {
    overview: makeResponse(budget, amountValue, budgetId),
    transactions,
  };
};

const makeTransactionsForLabelsOnly = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  month: Collections.Months.Entity,
  budgetId: string,
): Promise<GetBudgetOverviewWithTransactions> => {
  const transactionsDocuments = await getTransactionDocumentsForTheMonth(
    userId,
    month,
  );

  const budgetLabelIds = budget.labels.map((label) => label.id);

  const { transactions, ...amountValue } = transactionsDocuments.reduce(
    (
      previousValue: AmountValueWithTransactions,
      currentDocument,
    ): AmountValueWithTransactions => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      const labelsMatched =
        transaction.labels !== undefined &&
        transaction.labels.filter((label) => budgetLabelIds.includes(label.id))
          .length > 0;

      if (labelsMatched) {
        const currentAmountValue = transaction.transactionAmount;
        const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

        return {
          amount: previousValue.amount + transactionAmount,
          currency: currentAmountValue.currency,
          transactions: [
            ...previousValue.transactions,
            makeTransaction(transaction),
          ],
        };
      }

      return previousValue;
    },
    { amount: 0, currency: '', transactions: [] },
  );

  return {
    overview: makeResponse(budget, amountValue, budgetId),
    transactions,
  };
};

export const getTransactionsWithBudgetOverView = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  month: Collections.Months.Entity,
  budgetId: string,
): Promise<GetBudgetOverviewWithTransactions> => {
  const currentMonth: Collections.Months.Entity = {
    ...month,
    ...(month.current === true
      ? { endDate: moment().format('YYYY-MM-DD') }
      : {}),
  };

  switch (budget.operator) {
    case Collections.Budgets.BudgetCombination.CategoriesAndLabels:
      return makeTransactionsForCategoriesAndLabels(
        budget,
        userId,
        currentMonth,
        budgetId,
      );
    case Collections.Budgets.BudgetCombination.CategoriesOrLabels:
      return makeTransactionsForCategoriesOrLabels(
        budget,
        userId,
        currentMonth,
        budgetId,
      );
    case Collections.Budgets.BudgetCombination.CategoriesOnly:
      return makeTransactionsForCategoriesOnly(
        budget,
        userId,
        currentMonth,
        budgetId,
      );
    case Collections.Budgets.BudgetCombination.LabelsOnly:
      return makeTransactionsForLabelsOnly(
        budget,
        userId,
        currentMonth,
        budgetId,
      );
    default:
      throw new Error('Budget operator not defined for' + budget.name);
  }
};
