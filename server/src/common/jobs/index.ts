import { firestore } from '../firebase';
import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import { FieldPath } from '@google-cloud/firestore';

const makeSyncTransactionJob = (
  id: string,
  transaction: Collections.SyncTransactionsJobs.Entity,
): Services.SyncTransactionsJobs.Entity => ({
  id,
  createdAt: transaction.createdAt.toDate(),
  ...(transaction.error === undefined ? {} : { error: transaction.error }),
  ...(transaction.updatedTransactions === undefined
    ? {}
    : { updatedTransactions: transaction.updatedTransactions }),
  status: transaction.status,
  ...(transaction.lastUpdatedAt === undefined
    ? {}
    : { lastUpdatedAt: transaction.lastUpdatedAt.toDate() }),
});

export const getSyncTransactionsJobs = async (
  userId: string,
): Promise<Services.SyncTransactionsJobs.Entity[]> => {
  const snapshots = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.SyncTransactionsJobs)
    .orderBy(new FieldPath('createdAt'), 'desc')
    .limit(50)
    .get();

  return snapshots.docs.map((doc) =>
    makeSyncTransactionJob(
      doc.id,
      doc.data() as Collections.SyncTransactionsJobs.Entity,
    ),
  );
};

export const getLatestJob = async (
  userId: string,
): Promise<Services.SyncTransactionsJobs.Entity | undefined> => {
  const snapshots = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.SyncTransactionsJobs)
    .orderBy(new FieldPath('createdAt'), 'desc')
    .limit(1)
    .get();

  if (snapshots.size === 0) {
    return undefined;
  }

  const doc = snapshots.docs[0];

  return makeSyncTransactionJob(
    doc.id,
    doc.data() as Collections.SyncTransactionsJobs.Entity,
  );
};
