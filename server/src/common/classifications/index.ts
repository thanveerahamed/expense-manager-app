import { firestore } from '../firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';

export const queueRegenerateClassificationJob = async ({
  userId,
  transactionId,
  categoryId,
}: {
  userId: string;
  transactionId: string;
  categoryId: string;
}) => {
  const jobDocumentReference = firestore.collection(CollectionNames.Jobs).doc();
  const job: Collections.Jobs.Entity = {
    userId,
    transactionId,
    categoryId,
    type: Collections.Jobs.JobTypes.REGENERATE_CLASSIFICATIONS,
  };

  await jobDocumentReference.create(job);
};
