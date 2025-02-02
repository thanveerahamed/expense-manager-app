import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import { FieldPath, QuerySnapshot } from '@google-cloud/firestore';
import { firestore } from '../firebase';
import {
  calculateExpenseForCategoriesAndLabels,
  calculateExpenseForTransactions,
  calculateExpensesForCategoriesOrLabels,
  calculateExpensesForLabelsOnly,
} from './expense';
import {
  getTransactionDocumentsForTheMonth,
  getTransactionDocumentsWithMatchingCategories,
} from '../transactions';
import { makeResponse } from './index';
import { getCurrentMonth } from '../months';

export const getAmountString = (amount: number): string =>
  `${(amount / 10 ** 2).toFixed(2).toString()}`;

export const calculatePercentage = (
  budget: number,
  expense: number,
): number => {
  if (expense === 0) {
    return 0;
  }

  return Math.round((expense / budget) * 100);
};

export const createBudgetOverviewForCategoriesAndLabels = async ({
  id,
  budget,
  userId,
  currentMonth,
}: {
  id: string;
  budget: Collections.Budgets.Entity;
  userId: string;
  currentMonth: Collections.Months.Entity;
}): Promise<Services.Budgets.BudgetOverview> => {
  const transactionDocuments =
    await getTransactionDocumentsWithMatchingCategories(
      budget,
      userId,
      currentMonth,
    );

  const expenseAmount = calculateExpenseForCategoriesAndLabels(
    transactionDocuments,
    budget.labels,
  );

  return makeResponse(budget, expenseAmount, id);
};

export const createBudgetOverviewForCategoriesOnly = async ({
  id,
  budget,
  userId,
  currentMonth,
}: {
  id: string;
  budget: Collections.Budgets.Entity;
  userId: string;
  currentMonth: Collections.Months.Entity;
}): Promise<Services.Budgets.BudgetOverview> => {
  const transactionDocuments =
    await getTransactionDocumentsWithMatchingCategories(
      budget,
      userId,
      currentMonth,
    );

  const expenseAmount = calculateExpenseForTransactions(transactionDocuments);
  return makeResponse(budget, expenseAmount, id);
};

export const createBudgetOverviewForCategoriesOrLabels = async ({
  id,
  budget,
  userId,
  currentMonth,
}: {
  id: string;
  budget: Collections.Budgets.Entity;
  userId: string;
  currentMonth: Collections.Months.Entity;
}): Promise<Services.Budgets.BudgetOverview> => {
  const transactionDocumentsForTheMonth =
    await getTransactionDocumentsForTheMonth(userId, currentMonth);

  const expenseAmount = calculateExpensesForCategoriesOrLabels(
    transactionDocumentsForTheMonth,
    budget,
  );
  return makeResponse(budget, expenseAmount, id);
};

export const createBudgetOverviewForLabelsOnly = async ({
  id,
  budget,
  userId,
  currentMonth,
}: {
  id: string;
  budget: Collections.Budgets.Entity;
  userId: string;
  currentMonth: Collections.Months.Entity;
}): Promise<Services.Budgets.BudgetOverview> => {
  const transactionDocumentsForTheMonth =
    await getTransactionDocumentsForTheMonth(userId, currentMonth);

  const expenseAmount = calculateExpensesForLabelsOnly(
    transactionDocumentsForTheMonth,
    budget.labels.map((label) => label.id),
  );
  return makeResponse(budget, expenseAmount, id);
};

const makeBudgetOverview = async (
  budget: Collections.Budgets.Entity,
  id: string,
  userId: string,
  currentMonth: Collections.Months.Entity,
): Promise<Services.Budgets.BudgetOverview> => {
  switch (budget.operator) {
    case Collections.Budgets.BudgetCombination.CategoriesAndLabels:
      return createBudgetOverviewForCategoriesAndLabels({
        id,
        budget,
        userId,
        currentMonth,
      });

    case Collections.Budgets.BudgetCombination.CategoriesOrLabels:
      return createBudgetOverviewForCategoriesOrLabels({
        id,
        budget,
        userId,
        currentMonth,
      });

    case Collections.Budgets.BudgetCombination.CategoriesOnly:
      return createBudgetOverviewForCategoriesOnly({
        id,
        budget,
        userId,
        currentMonth,
      });

    case Collections.Budgets.BudgetCombination.LabelsOnly:
      return createBudgetOverviewForLabelsOnly({
        id,
        budget,
        userId,
        currentMonth,
      });

    default:
      throw new Error('Budget operator not defined for' + id);
  }
};

export const makeBudgetsOverviews = async (
  snapshots: QuerySnapshot<Collections.Budgets.Entity>,
  userId: string,
  month?: Collections.Months.Entity,
): Promise<Services.Budgets.BudgetOverview[]> => {
  const currentMonth = month ?? (await getCurrentMonth(userId));

  if (currentMonth === undefined) {
    return [];
  }

  const promiseList = snapshots.docs.map(
    async (budgetDocument): Promise<Services.Budgets.BudgetOverview> => {
      const id = budgetDocument.id;
      const budget = budgetDocument.data();

      return makeBudgetOverview(budget, id, userId, currentMonth);
    },
  );

  return Promise.all(promiseList);
};

export const getBudgetsOverviews = async ({
  userId,
  month,
  limit,
}: {
  userId: string;
  month?: Collections.Months.Entity;
  limit: number;
}): Promise<Services.Budgets.GetBudgetsOverviews> => {
  const snapshots = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .orderBy(new FieldPath('updatedAt'), 'desc')
    .limit(limit)
    .get()) as QuerySnapshot<Collections.Budgets.Entity>;

  if (snapshots.size === 0) {
    return { budgets: [] };
  }

  return { budgets: await makeBudgetsOverviews(snapshots, userId, month) };
};
