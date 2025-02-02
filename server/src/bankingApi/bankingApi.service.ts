import {
  AccessTokenDetails,
  Transaction,
  TransactionStatus,
} from '../common/thirdParty/nordigen/types';
import {
  createEndUserAgreement,
  createRequisition as createNordigenRequisition,
  getAccessToken as getNordigenAccessToken,
  getBalances as getNordigenBalances,
  getTransactions as getNordigenTransactions,
} from '../common/thirdParty/nordigen/endpoints';
import {
  CollectionNames,
  Collections,
  Services,
} from '@expense-manager/schema';
import { firestore } from '../common/firebase';
import { NORDIGEN_TEXT } from '../common/thirdParty/nordigen/constants';
import { FieldPath } from '@google-cloud/firestore';
import { v4 as uuidV4 } from 'uuid';
import { getRequisition } from '../common/thirdParty/nordigen/endpoints/getRequisition';

export const getAccessToken = async (): Promise<AccessTokenDetails> => {
  return getNordigenAccessToken();
};

export const getTransactions = async (
  accountId: string,
): Promise<Transaction[]> => {
  const nordigenTransactions = await getNordigenTransactions(accountId);
  return [
    ...nordigenTransactions.transactions.pending.map(
      (transaction): Transaction => ({
        ...transaction,
        transactionStatus: TransactionStatus.Pending,
        bookingDate: transaction.valueDate,
      }),
    ),
    ...nordigenTransactions.transactions.booked.map(
      (transaction): Transaction => ({
        ...transaction,
        transactionStatus: TransactionStatus.Booked,
      }),
    ),
  ];
};

export const getBalances = async (
  accountId: string,
): Promise<Services.BankingApi.NordigenBalances> => {
  return getNordigenBalances(accountId);
};

export const createRequisition = async (
  institution: Collections.BankingApi.Institution,
  redirectUrl: string,
  userId: string,
) => {
  const agreement = await createEndUserAgreement({
    institutionId: institution.id,
  });
  const requisitionResponse = await createNordigenRequisition({
    institutionId: institution.id,
    agreementId: agreement.id,
    redirectUrl,
  });

  const requisition: Collections.BankingApi.Nordigen = {
    requisition: {
      ...requisitionResponse,
      expired: false,
      failed: false,
    },
  };

  await firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NORDIGEN_TEXT)
    .set(requisition, { merge: true });

  return requisitionResponse;
};

export const updateRequisitionFailedStatus = async (
  userId: string,
  failed: boolean,
) => {
  const documentReference = firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NORDIGEN_TEXT);

  await documentReference.update(
    new FieldPath('requisition', 'failed'),
    failed,
  );
};

export const attemptRequisition = async ({
  userId,
  redirectUrl,
}: {
  userId: string;
  redirectUrl: string;
}) => {
  const { access } = await getAccessToken();
  const reference = uuidV4();
  const documentReference = firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NORDIGEN_TEXT);

  const {
    requisition: { institution_id: institutionId },
  } = (await documentReference.get()).data() as {
    requisition: Collections.BankingApi.NordigenRequisition;
  };
  const { id: agreementId } = await createEndUserAgreement({
    institutionId,
    token: access,
  });
  const requisitionResponse = await createNordigenRequisition({
    institutionId,
    agreementId,
    redirectUrl,
    reference,
    token: access,
  });

  const requisitionAttemptDocumentReference = firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(reference);

  await requisitionAttemptDocumentReference.create(requisitionResponse);

  return { redirectLink: requisitionResponse.link, reference };
};

export const attemptRequisitionSuccess = async ({
  userId,
  reference,
}: {
  userId: string;
  reference: string;
}) => {
  const requisitionAttemptDocumentReference = firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(reference);

  const newDocument = (
    await requisitionAttemptDocumentReference.get()
  ).data() as Collections.BankingApi.CreateRequisitionResponse;

  const requisitionResponse = await getRequisition(newDocument.id);

  if (requisitionResponse.status === 'LN') {
    const requisition = {
      ...requisitionResponse,
      expired: false,
      failed: false,
    };

    await firestore
      .collection(CollectionNames.Users)
      .doc(userId)
      .collection(CollectionNames.BankingApis)
      .doc(NORDIGEN_TEXT)
      .set({ requisition }, { merge: true });
  } else {
    await requisitionAttemptDocumentReference.update(
      new FieldPath('failed'),
      true,
    );
    throw new Error('Requisition linking failed for userId: ' + userId);
  }
};
