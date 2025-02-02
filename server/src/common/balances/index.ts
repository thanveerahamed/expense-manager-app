import { CollectionNames, Collections, Shared } from '@expense-manager/schema';
import { firestore } from '../firebase';
import { DocumentSnapshot } from '@google-cloud/firestore';

export const defaultMoneyValue = {
  amount: '0.00',
  currency: 'EUR',
};

export const getAccountBalance = async ({
  userId,
}: {
  userId: string;
}): Promise<Shared.Money.Money> => {
  const documentSnapshot = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .get()) as DocumentSnapshot<Collections.DailyExpense.Entity>;

  const userDocument = documentSnapshot.data();

  if (
    !documentSnapshot.exists ||
    userDocument === undefined ||
    userDocument.balances.length === 0
  ) {
    return defaultMoneyValue;
  }

  return userDocument.balances[0].balanceAmount;
};
