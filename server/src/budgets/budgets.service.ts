import { firestore } from '../common/firebase';
import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import {
  DocumentReference,
  DocumentSnapshot,
  Timestamp,
} from '@google-cloud/firestore';
import {
  getBudgetsOverviews,
  getTransactionsWithBudgetOverView,
} from '../common/budgets';
import { GetBudgetOverviewWithTransactions } from './budgets.interface';

export const getBudgetById = async ({
  userId,
  budgetId,
}: {
  userId: string;
  budgetId: string;
}): Promise<{ budget: Services.Budgets.Budget }> => {
  const snapshot = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .doc(budgetId)
    .get()) as DocumentSnapshot<Collections.Budgets.Entity>;

  const budgetEntity = snapshot.data();

  if (!snapshot.exists || budgetEntity === undefined) {
    throw new Error(`Unable to find the budget with id ${budgetId}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createdAt, updatedAt, ...rest } = budgetEntity;

  return {
    budget: {
      ...rest,
      id: budgetId,
    },
  };
};

export const getAll = async ({
  userId,
  month,
}: {
  userId: string;
  month?: Collections.Months.Entity;
}): Promise<Services.Budgets.GetBudgetsOverviews> => {
  return getBudgetsOverviews({ userId, month, limit: 100 });
};

export const getTransactionByBudget = async ({
  userId,
  month,
  budgetId,
}: {
  userId: string;
  budgetId: string;
  month: Collections.Months.Entity;
}): Promise<GetBudgetOverviewWithTransactions> => {
  const snapshot = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .doc(budgetId)
    .get()) as DocumentSnapshot<Collections.Budgets.Entity>;

  const budget = snapshot.data();

  if (budget === undefined) {
    throw new Error(`Unable to find the budget: ${budgetId}`);
  }

  return getTransactionsWithBudgetOverView(budget, userId, month, budgetId);
};

export const create = async ({
  userId,
  budget,
}: {
  userId: string;
  budget: Services.Budgets.Budget;
}) => {
  const budgetDocumentReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .doc();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...rest } = budget;

  const newBudget: Collections.Budgets.Entity = {
    ...rest,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await budgetDocumentReference.create(newBudget);

  return { ...budget, id: budgetDocumentReference.id };
};

export const update = async ({
  userId,
  budget,
}: {
  userId: string;
  budget: Services.Budgets.Budget;
}) => {
  const budgetDocumentReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .doc(budget.id) as DocumentReference<Collections.Budgets.Entity>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...rest } = budget;

  const updatedBudget: Collections.Budgets.Entity = {
    ...rest,
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  };

  await budgetDocumentReference.update(updatedBudget);

  return { ...budget, id: budgetDocumentReference.id };
};

export const deleteBudget = async ({
  userId,
  budgetId,
}: {
  userId: string;
  budgetId: string;
}): Promise<void> => {
  const snapshot = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Budgets)
    .doc(budgetId)
    .get()) as DocumentSnapshot<Collections.Budgets.Entity>;

  if (!snapshot.exists) {
    throw new Error(`Unable to find the budget with id ${budgetId}`);
  }

  await snapshot.ref.delete();
};
