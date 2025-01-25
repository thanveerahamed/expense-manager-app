import { firestore } from "../../../common/firebase";
import { CollectionNames, Collections } from "@expense-manager/schema";
import {
  DocumentReference,
  FieldPath,
  Timestamp,
} from "@google-cloud/firestore";

export const createJob = async (userId: string): Promise<DocumentReference> => {
  const syncTransactionsJobDocumentReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.SyncTransactionsJobs)
    .doc();

  const syncJob: Collections.SyncTransactionsJobs.Entity = {
    createdAt: Timestamp.now(),
    status: Collections.SyncTransactionsJobs.SyncTransactionsJobStatus.QUEUED,
  };

  await syncTransactionsJobDocumentReference.create(syncJob);

  return syncTransactionsJobDocumentReference;
};

export const setJobComplete = async ({
  syncJobDocumentReference,
  transactions,
}: {
  syncJobDocumentReference: DocumentReference;
  transactions: string[];
}): Promise<void> => {
  await syncJobDocumentReference.update(
    new FieldPath("lastUpdatedAt"),
    Timestamp.now(),
    new FieldPath("status"),
    Collections.SyncTransactionsJobs.SyncTransactionsJobStatus.COMPLETED,
    new FieldPath("updatedTransactions"),
    transactions
  );
};

export const setJobFailed = async ({
  syncJobDocumentReference,
  errorMessage,
}: {
  syncJobDocumentReference: DocumentReference;
  errorMessage: string;
}): Promise<void> => {
  await syncJobDocumentReference.update(
    new FieldPath("lastUpdatedAt"),
    Timestamp.now(),
    new FieldPath("status"),
    Collections.SyncTransactionsJobs.SyncTransactionsJobStatus.FAILED,
    new FieldPath("error"),
    errorMessage
  );
};
