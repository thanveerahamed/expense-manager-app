import {
  DocumentSnapshot,
  FieldPath,
  WriteBatch,
} from "@google-cloud/firestore";
import { firestore } from "../../../common/firebase";
import { CollectionNames, Collections } from "@expense-manager/schema";
import {
  getTransactionName,
  getTransactionType,
} from "../../../common/transactions";
import { logInfo } from "../../../common/logger";
import { getClassifiedCategory } from "./category";

const createChuckedTransactionIds = (
  newTransactionIds: string[]
): Array<string[]> => {
  const chunkedTransactionGroup = new Array<string[]>();

  for (let index = 0; index < newTransactionIds.length; index += 10) {
    const chunk = newTransactionIds.slice(index, index + 10);
    chunkedTransactionGroup.push(chunk);
  }

  return chunkedTransactionGroup;
};

export const maybeGetTheLastStoredDocument = async ({
  userId,
}: {
  userId: string;
}): Promise<DocumentSnapshot | undefined> => {
  const firstBooked = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .orderBy(new FieldPath("bookingDate"), "desc")
    .limit(1)
    .get();

  if (firstBooked.size === 1) {
    return firstBooked.docs[0];
  }

  return undefined;
};

export const getNewTransactions = async ({
  userId,
  transactions,
}: {
  userId: string;
  transactions: Collections.Transactions.BankingAPITransaction[];
}): Promise<Collections.Transactions.BankingAPITransaction[]> => {
  const latestDocument = await maybeGetTheLastStoredDocument({ userId });

  if (latestDocument === undefined) {
    return transactions;
  }

  const latestTransaction =
    latestDocument.data() as Collections.Transactions.Entity;
  return transactions.reduce(
    (
      previousTransactions: Collections.Transactions.BankingAPITransaction[],
      currentTransaction
    ): Collections.Transactions.BankingAPITransaction[] => {
      if (currentTransaction.bookingDate >= latestTransaction.bookingDate) {
        return [...previousTransactions, currentTransaction];
      }

      return previousTransactions;
    },
    []
  );
};

export const getExistingMatchingTransactions = async ({
  userId,
  transactionIds,
}: {
  userId: string;
  transactionIds: string[];
}): Promise<Collections.Transactions.Entity[]> => {
  const transactionIdsGroups = createChuckedTransactionIds(transactionIds);

  const matchingTransactions: Collections.Transactions.Entity[] = [];

  for (const chunkedTransactionGroupElement of transactionIdsGroups) {
    const tempSnapshots = await firestore
      .collection(CollectionNames.DailyExpense)
      .doc(userId)
      .collection(CollectionNames.Transactions)
      .where(
        new FieldPath("transactionId"),
        "in",
        chunkedTransactionGroupElement
      )
      .get();

    matchingTransactions.push(
      ...tempSnapshots.docs.map(
        (doc) => doc.data() as Collections.Transactions.Entity
      )
    );
  }

  return matchingTransactions;
};

async function updateSalaryMonths(
  userId: string,
  newTransaction: Collections.Transactions.BankingAPITransaction,
  batch: FirebaseFirestore.WriteBatch
) {
  logInfo("Salary transaction");
  const monthsSnapshot = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Months)
    .where(new FieldPath("current"), "==", true)
    .get();

  if (monthsSnapshot.size === 1) {
    const endDate = newTransaction.bookingDate;
    const currentMonth =
      monthsSnapshot.docs[0].data() as Collections.Months.Entity;
    const monthDocumentId = monthsSnapshot.docs[0].id;

    if (currentMonth.startDate < endDate) {
      const previousMonthDocumentReference = firestore
        .collection(CollectionNames.DailyExpense)
        .doc(userId)
        .collection(CollectionNames.Months)
        .doc(monthDocumentId);

      batch.update(
        previousMonthDocumentReference,
        new FieldPath("endDate"),
        endDate,
        new FieldPath("current"),
        false
      );

      const currentMonthDocumentReference = firestore
        .collection(CollectionNames.DailyExpense)
        .doc(userId)
        .collection(CollectionNames.Months)
        .doc();

      batch.create(currentMonthDocumentReference, {
        startDate: endDate,
        current: true,
      });
    }
  }
}

export const addNewTransaction = async (
  newTransaction: Collections.Transactions.BankingAPITransaction,
  userId: string,
  batch: WriteBatch
) => {
  const type = getTransactionType(newTransaction);
  const name = getTransactionName(newTransaction);
  const category = await getClassifiedCategory(type, name);

  const newTransactionReference = firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(newTransaction.transactionId);

  batch.create(newTransactionReference, {
    ...newTransaction,
    type,
    category,
    dirty: false,
    newRecord: true,
  });

  if (category.name.indexOf("Salary") > -1) {
    await updateSalaryMonths(userId, newTransaction, batch);
  }
};
