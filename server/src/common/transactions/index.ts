import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import {
  FieldPath,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { splitEvery } from 'ramda';
import { firestore } from '../firebase';
import dayjs from 'dayjs';

export const isExcludedCategory = (name: string): boolean =>
  ['Transfers', 'Savings', 'Exclude'].includes(name);

export const getTransactionDocumentsForTheMonth = async (
  userId: string,
  currentMonth: Collections.Months.Entity,
): Promise<QueryDocumentSnapshot<Collections.Transactions.Entity>[]> => {
  const snapshots = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .where(new FieldPath('bookingDate'), '>=', currentMonth.startDate)
    .where(new FieldPath('bookingDate'), '<=', currentMonth.endDate)
    .where(
      new FieldPath('type'),
      '==',
      Collections.Transactions.TransactionType.Debit,
    )
    .orderBy(new FieldPath('bookingDate'), 'desc')
    .get()) as QuerySnapshot<Collections.Transactions.Entity>;

  return snapshots.docs;
};

export const getTransactionDocumentsForTheYear = async (
  userId: string,
  year: string,
): Promise<QueryDocumentSnapshot<Collections.Transactions.Entity>[]> => {
  const snapshots = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .where(
      new FieldPath('type'),
      '==',
      Collections.Transactions.TransactionType.Debit,
    )
    .where(new FieldPath('bookingDate'), '>=', `${year}-01-01`)
    .where(new FieldPath('bookingDate'), '<=', `${year}-12-31`)
    .orderBy(new FieldPath('bookingDate'), 'desc')
    .get()) as QuerySnapshot<Collections.Transactions.Entity>;

  return snapshots.docs;
};

export const getTransactionDocumentsBetweenDates = async (
  userId: string,
  startDate: string,
  endDate: string,
  type: Collections.Transactions.TransactionType | 'all' = Collections
    .Transactions.TransactionType.Debit,
): Promise<QueryDocumentSnapshot<Collections.Transactions.Entity>[]> => {
  const startMilliseconds = dayjs(startDate, 'YYYY-MM-DD');
  const endMilliseconds = dayjs(endDate, 'YYYY-MM-DD');
  if (startMilliseconds > endMilliseconds) {
    throw new Error(
      `startDate: ${startDate} is greater than endDate: ${endDate}`,
    );
  }

  const query = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .where(new FieldPath('bookingDate'), '>=', startDate)
    .where(new FieldPath('bookingDate'), '<=', endDate);

  if (type !== 'all') {
    query.where(
      new FieldPath('type'),
      '==',
      Collections.Transactions.TransactionType.Debit,
    );
  }

  query.orderBy(new FieldPath('bookingDate'), 'desc');

  const snapshots =
    (await query.get()) as QuerySnapshot<Collections.Transactions.Entity>;

  return snapshots.docs;
};

export const getTransactionDocumentsWithMatchingCategories = async (
  budget: Collections.Budgets.Entity,
  userId: string,
  currentMonth: Collections.Months.Entity,
): Promise<QueryDocumentSnapshot<Collections.Transactions.Entity>[]> => {
  const transactionQuery: Array<
    Promise<QuerySnapshot<Collections.Transactions.Entity>>
  > = splitEvery(10, budget.categories).map(
    (
      categories: Collections.Category.Entity[],
    ): Promise<QuerySnapshot<Collections.Transactions.Entity>> =>
      firestore
        .collection(CollectionNames.DailyExpense)
        .doc(userId)
        .collection(CollectionNames.Transactions)
        .where(
          new FieldPath('category', 'id'),
          'in',
          categories.map((category) => category.id),
        )
        .where(new FieldPath('bookingDate'), '>=', currentMonth.startDate)
        .where(new FieldPath('bookingDate'), '<=', currentMonth.endDate)
        .where(
          new FieldPath('type'),
          '==',
          Collections.Transactions.TransactionType.Debit,
        )
        .orderBy(new FieldPath('bookingDate'), 'desc')
        .get() as Promise<QuerySnapshot<Collections.Transactions.Entity>>,
  );

  return (await Promise.all(transactionQuery)).flatMap(
    (queryResult): QueryDocumentSnapshot<Collections.Transactions.Entity>[] =>
      queryResult.docs,
  );
};

export const makeTransaction = (
  transaction: Collections.Transactions.Entity,
): Services.Transactions.Transaction => {
  return {
    id: transaction.transactionId,
    name: Collections.Transactions.getVendorName(transaction),
    amount: transaction.transactionAmount.amount,
    currency: transaction.transactionAmount.currency,
    type: transaction.type,
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      parentName: transaction.category.parent,
    },
    bookingDate: transaction.bookingDate,
    labels: transaction.labels,
    notes: transaction.notes,
    unStructuredDetails: transaction.remittanceInformationUnstructured,
    newRecord: transaction.newRecord || false,
  };
};

export const makeHighLevelTransactions = (
  snapshots: QuerySnapshot,
): Services.Transactions.Transaction[] => {
  return snapshots.docs.map(
    (transactionDocument): Services.Transactions.Transaction => {
      const transaction =
        transactionDocument.data() as Collections.Transactions.Entity;

      return makeTransaction(transaction);
    },
  );
};

export const getTransactions = async ({
  userId,
  nextPageToken,
  limit,
}: {
  userId: string;
  nextPageToken?: string;
  limit: number;
}): Promise<Services.Transactions.GetTransactionsResponse> => {
  let query = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .orderBy(new FieldPath('bookingDate'), 'desc');

  query = query.limit(limit);

  if (nextPageToken !== undefined) {
    const nextPageSnapshot = await firestore
      .collection(CollectionNames.DailyExpense)
      .doc(userId)
      .collection(CollectionNames.Transactions)
      //.where(new FieldPath("transactionId"), "==", nextPageToken)
      .doc(nextPageToken)
      .get();
    query = query.startAfter(nextPageSnapshot);
  }

  const transactionSnapshots = await query.get();

  if (transactionSnapshots.size === 0) {
    return {
      transactions: [],
      nextPageToken: undefined,
    };
  }

  if (transactionSnapshots.size < limit) {
    return {
      transactions: makeHighLevelTransactions(transactionSnapshots),
      nextPageToken: undefined,
    };
  }

  return {
    transactions: makeHighLevelTransactions(transactionSnapshots),
    nextPageToken: transactionSnapshots.docs[transactionSnapshots.size - 1].id,
  };
};

export const getNewTransactionsFromFirestore = async ({
  userId,
}: {
  userId: string;
}) => {
  const transactionSnapshots = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .where(new FieldPath('newRecord'), '==', true)
    .orderBy(new FieldPath('bookingDate'), 'desc')
    .get();

  return makeHighLevelTransactions(transactionSnapshots);
};

export const setNewRecordToOldRecord = async ({
  userId,
  transactionId,
}: {
  userId: string;
  transactionId: string;
}) => {
  await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId)
    .update(new FieldPath('newRecord'), false);
};
