import { QueryDocumentSnapshot } from '@google-cloud/firestore';
import { Collections } from '@expense-manager/schema';
import { LabelWithId } from '@expense-manager/schema/lib/collections/labels';
import { AmountValue } from '../../budgets/budgets.interface';
import { isExcludedCategory } from '../transactions';

export const calculateExpenseForCategoriesAndLabels = (
  documentSnapshots: QueryDocumentSnapshot<
    Pick<
      Collections.Transactions.Entity,
      'transactionId' | 'transactionAmount' | 'labels' | 'category'
    >
  >[],
  budgetLabels: Omit<LabelWithId, 'createdAt'>[],
): AmountValue => {
  const budgetLabelIds = budgetLabels.map((label) => label.id);
  return documentSnapshots.reduce(
    (previousValue: AmountValue, currentDocument): AmountValue => {
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
      };
    },
    { amount: 0, currency: '' },
  );
};

export const calculateExpenseForTransactions = (
  transactionDocumentSnapshots: QueryDocumentSnapshot<
    Pick<
      Collections.Transactions.Entity,
      'transactionId' | 'transactionAmount' | 'category'
    >
  >[],
): AmountValue => {
  return transactionDocumentSnapshots.reduce(
    (previousValue: AmountValue, currentDocument): AmountValue => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      const currentAmountValue = transaction.transactionAmount;
      const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

      return {
        amount: previousValue.amount + transactionAmount,
        currency: currentAmountValue.currency,
      };
    },
    { amount: 0, currency: '' },
  );
};

export const calculateExpensesForCategoriesOrLabels = (
  transactionDocuments: QueryDocumentSnapshot<
    Pick<
      Collections.Transactions.Entity,
      'transactionId' | 'transactionAmount' | 'labels' | 'category'
    >
  >[],
  budget: Collections.Budgets.Entity,
): AmountValue => {
  const budgetLabelIds = budget.labels.map((label) => label.id);
  const budgetCategoryIds = budget.categories.map((category) => category.id);
  return transactionDocuments.reduce(
    (previousValue: AmountValue, currentDocument): AmountValue => {
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
        };
      }

      return previousValue;
    },
    { amount: 0, currency: '' },
  );
};

export const calculateExpensesForLabelsOnly = (
  transactionDocuments: QueryDocumentSnapshot<
    Pick<
      Collections.Transactions.Entity,
      'transactionId' | 'transactionAmount' | 'labels' | 'category'
    >
  >[],
  labelIds: string[],
): AmountValue => {
  return transactionDocuments.reduce(
    (previousValue: AmountValue, currentDocument): AmountValue => {
      const transaction = currentDocument.data();

      if (isExcludedCategory(transaction.category.name)) {
        return previousValue;
      }

      const labelsMatched =
        transaction.labels !== undefined &&
        transaction.labels.filter((label) => labelIds.includes(label.id))
          .length > 0;

      if (labelsMatched) {
        const currentAmountValue = transaction.transactionAmount;
        const transactionAmount = parseFloat(currentAmountValue.amount) * -1;

        return {
          amount: previousValue.amount + transactionAmount,
          currency: currentAmountValue.currency,
        };
      }

      return previousValue;
    },
    { amount: 0, currency: '' },
  );
};
