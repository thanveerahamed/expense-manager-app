import { firestore } from '../../firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';
import { NORDIGEN_TEXT } from './constants';
import { DocumentReference } from '@google-cloud/firestore';

export const getAccountSetupInformation = async (
  userId: string,
): Promise<{ isSetup: boolean; isExpired?: boolean; isFailed?: boolean }> => {
  const documentReference = firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NORDIGEN_TEXT) as DocumentReference<Collections.BankingApi.Nordigen>;

  const document = await documentReference.get();
  const data = document.data();

  if (document.exists && data !== undefined) {
    return {
      isSetup: true,
      isExpired: data.requisition.expired,
      isFailed: data.requisition.failed,
    };
  } else {
    return {
      isSetup: false,
    };
  }
};
