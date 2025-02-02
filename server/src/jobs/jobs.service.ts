import { firestore } from '../common/firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';
import { DocumentReference } from '@google-cloud/firestore';

export const createSyncTransactionsJob = async (userId: string) => {
  const documentReference = firestore
    .collection(CollectionNames.Jobs)
    .doc() as DocumentReference<
    Collections.Jobs.SyncTransactionsJob<Collections.Jobs.JobTypes.SYNC_TRANSACTIONS>
  >;

  const syncTransactionTask: Collections.Jobs.SyncTransactionsJob<Collections.Jobs.JobTypes.SYNC_TRANSACTIONS> =
    {
      userId,
      type: Collections.Jobs.JobTypes.SYNC_TRANSACTIONS,
    };

  await documentReference.create(syncTransactionTask);
};
