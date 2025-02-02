import { firestore } from '../common/firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';
import { DocumentReference, Timestamp } from '@google-cloud/firestore';
import { getLabels } from '../common/labels';

export const addLabel = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}): Promise<Collections.Labels.LabelWithId[]> => {
  const documentReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Labels)
    .doc() as DocumentReference<Collections.Labels.Entity>;

  await documentReference.create({
    name,
    createdAt: Timestamp.now(),
  });

  return getLabels({ userId });
};
