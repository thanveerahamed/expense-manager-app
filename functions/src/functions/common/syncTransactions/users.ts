import { firestore } from "../../../common/firebase";
import { CollectionNames } from "@expense-manager/schema";
import { NordigenName } from "../../../common/constants";
import { FieldPath } from "@google-cloud/firestore";

export const getAllUsersWithRequisitionAndAccountId = async (): Promise<
  { userId: string; accountId: string }[]
> => {
  const users: { userId: string; accountId: string }[] = [];
  const usersSnapshots = await firestore
    .collection(CollectionNames.Users)
    .get();

  for (const userDocument of usersSnapshots.docs) {
    const userId = userDocument.id;
    const userNordigenDocumentSnapshot = await firestore
      .collection(CollectionNames.Users)
      .doc(userId)
      .collection(CollectionNames.BankingApis)
      .doc(NordigenName)
      .get();

    if (
      userNordigenDocumentSnapshot.exists &&
      userNordigenDocumentSnapshot.data() !== undefined
    ) {
      if (
        userNordigenDocumentSnapshot.data()?.requisition.accounts.length > 0 &&
        userNordigenDocumentSnapshot.data()?.requisition.expired === false
      ) {
        users.push({
          userId,
          accountId:
            userNordigenDocumentSnapshot.data()?.requisition.accounts[0],
        });
      }
    }
  }

  return users;
};

export const setRequisitionExpired = async ({ userId }: { userId: string }) => {
  await firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NordigenName)
    .update(new FieldPath("expired"), true);
};

export const getAccountId = async ({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> => {
  const userNordigenDocumentSnapshot = await firestore
    .collection(CollectionNames.Users)
    .doc(userId)
    .collection(CollectionNames.BankingApis)
    .doc(NordigenName)
    .get();

  if (
    userNordigenDocumentSnapshot.exists &&
    userNordigenDocumentSnapshot.data() !== undefined
  ) {
    if (
      userNordigenDocumentSnapshot.data()?.requisition.accounts.length > 0 &&
      userNordigenDocumentSnapshot.data()?.requisition.expired === false &&
      userNordigenDocumentSnapshot.data()?.requisition.failed === false
    ) {
      return userNordigenDocumentSnapshot.data()?.requisition.accounts[0];
    }
  }

  return undefined;
};
