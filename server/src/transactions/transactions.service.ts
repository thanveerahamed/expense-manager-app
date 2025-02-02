import { firestore } from '../common/firebase';
import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import {
  DocumentReference,
  FieldPath,
  FieldValue,
} from '@google-cloud/firestore';
import { queueRegenerateClassificationJob } from '../common/classifications';
import {
  getTransactionDocumentsBetweenDates,
  getTransactions as getTransactionsBase,
  makeHighLevelTransactions,
  makeTransaction,
} from '../common/transactions';
import { getAmountString } from '../common/budgets';
import { GetTransactionsBetweenDatesPayload } from './transactions.interface';

const BATCH_LIMIT = 100;

export const getTransactions = async ({
  userId,
  nextPageToken,
}: {
  userId: string;
  nextPageToken?: string;
}): Promise<Services.Transactions.GetTransactionsResponse> => {
  return getTransactionsBase({ userId, nextPageToken, limit: BATCH_LIMIT });
};

export const getTransactionsUntil = async ({
  userId,
  transactionId,
}: {
  userId: string;
  transactionId: string;
}): Promise<Services.Transactions.Transaction[]> => {
  let query = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .orderBy(new FieldPath('bookingDate'), 'desc');

  const nextPageSnapshot = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId)
    .get();

  query = query.endAt(nextPageSnapshot);

  const transactionSnapshots = await query.get();

  return makeHighLevelTransactions(transactionSnapshots);
};

export const assignLabels = async ({
  userId,
  labels,
  transactionId,
}: {
  userId: string;
  transactionId: string;
  labels: Collections.Transactions.TransactionLabel[];
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  await transactionReference.update(new FieldPath('labels'), labels);

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const getTransactionById = async (
  transactionId: string,
  userId: string,
): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const unAssignLabels = async ({
  userId,
  label,
  transactionId,
}: {
  userId: string;
  transactionId: string;
  label: Collections.Transactions.TransactionLabel;
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  await transactionReference.update({
    labels: FieldValue.arrayRemove(label),
  });

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const assignCategory = async ({
  userId,
  categoryId,
  transactionId,
}: {
  userId: string;
  transactionId: string;
  categoryId: string;
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  const categoryDocumentSnapshot = await firestore
    .collection(CollectionNames.Categories)
    .doc(categoryId)
    .get();

  const category = {
    ...categoryDocumentSnapshot.data(),
    id: categoryDocumentSnapshot.id,
  };

  await transactionReference.update(new FieldPath('category'), category);

  await queueRegenerateClassificationJob({ userId, categoryId, transactionId });

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const updateVendorName = async ({
  userId,
  transactionId,
  name,
}: {
  userId: string;
  transactionId: string;
  name: string;
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  await transactionReference.update(new FieldPath('creditorName'), name);

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const updateNewRecord = async ({
  userId,
  transactionId,
  name,
}: {
  userId: string;
  transactionId: string;
  name: string;
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  await transactionReference.update(new FieldPath('creditorName'), name);

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

export const updateNote = async ({
  userId,
  transactionId,
  note,
}: {
  userId: string;
  transactionId: string;
  note: string;
}): Promise<Services.Transactions.Transaction> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  await transactionReference.update(new FieldPath('notes'), note);

  const transaction = (
    await transactionReference.get()
  ).data() as Collections.Transactions.Entity;

  return makeTransaction(transaction);
};

const makeId = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const splitTransaction = async ({
  userId,
  transactionId,
  amounts,
}: {
  userId: string;
  transactionId: string;
  amounts: number[];
}): Promise<void> => {
  const transactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId) as DocumentReference<Collections.Transactions.Entity>;

  const transaction = (await transactionReference.get()).data();

  if (transaction === undefined) {
    throw new Error(`Unable to find transaction ${transactionId} `);
  }

  const batch = firestore.batch();

  amounts.forEach((amount) => {
    const newTransactionId = `${transactionId}_${makeId(5)}`;

    const newTransaction = {
      ...transaction,
      transactionAmount: {
        ...transaction.transactionAmount,
        amount: getAmountString(amount * 100),
      },
      transactionId: newTransactionId,
    };

    const newTransactionReference = firestore
      .collection(CollectionNames.DailyExpense)
      .doc(userId)
      .collection(CollectionNames.Transactions)
      .doc(
        newTransactionId,
      ) as DocumentReference<Collections.Transactions.Entity>;

    batch.create(newTransactionReference, newTransaction);
  });

  await batch.delete(transactionReference).commit();
};

export const getTransactionsBetweenDates = async ({
  userId,
  startDate,
  endDate,
  labelId,
}: GetTransactionsBetweenDatesPayload) => {
  const docs = await getTransactionDocumentsBetweenDates(
    userId,
    startDate,
    endDate,
    'all',
  );

  return docs.reduce(
    (
      accumulatedDocuments: Services.Transactions.Transaction[],
      transactionDocument,
    ): Services.Transactions.Transaction[] => {
      const transaction =
        transactionDocument.data() as Collections.Transactions.Entity;

      if (labelId) {
        if (
          transaction.labels &&
          transaction.labels.find((label) => label.id === labelId)
        ) {
          return [...accumulatedDocuments, makeTransaction(transaction)];
        } else {
          return accumulatedDocuments;
        }
      }

      return [...accumulatedDocuments, makeTransaction(transaction)];
    },
    [],
  );
};
