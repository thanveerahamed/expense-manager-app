import { createJob, setJobComplete, setJobFailed } from "./jobs";
import { firestore, getAuthToken } from "../../../common/firebase";
import {
  getBalances,
  getBankingTransactions,
} from "../../../common/api/bankingApi";
import {
  addNewTransaction,
  getExistingMatchingTransactions,
  getNewTransactions,
} from "./transactions";
import { CollectionNames, Collections } from "@expense-manager/schema";
import { logError, logInfo } from "../../../common/logger";
import { setRequisitionExpired } from "./users";
import { DocumentReference } from "@google-cloud/firestore";
import { makeBalance } from "./mapper";

async function updateTransactions(
  newTransactions: Collections.Transactions.BankingAPITransaction[],
  existingMatchingTransactions: Collections.Transactions.Entity[],
  userId: string
) {
  const batch = firestore.batch();

  for (const newTransaction of newTransactions) {
    const matchingTransactionDocument = existingMatchingTransactions.find(
      (transaction): boolean =>
        transaction.transactionId === newTransaction.transactionId
    );

    if (matchingTransactionDocument === undefined) {
      await addNewTransaction(newTransaction, userId, batch);
    } else if (matchingTransactionDocument.dirty !== true) {
      const newTransactionReference = firestore
        .collection(CollectionNames.DailyExpense)
        .doc(userId)
        .collection(CollectionNames.Transactions)
        .doc(newTransaction.transactionId);

      batch.update(newTransactionReference, {
        ...newTransaction,
        dirty: false,
      });
    }
  }

  await batch.commit();
}

export const syncTransactions = async ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  logInfo(`Processing transactions for userId ${userId}`);
  const syncJobDocumentReference = await createJob(userId);

  try {
    const token = await getAuthToken(userId);
    const transactions = await getBankingTransactions({
      token,
      body: { accountId },
    });

    logInfo("Banking transaction obtained");

    const nordigenBalances = await getBalances({
      token,
      body: { accountId },
    });

    logInfo("Banking balances obtained. Count: " + transactions.length, {
      count: transactions.length,
    });

    const newTransactions = await getNewTransactions({
      userId,
      transactions,
    });
    const newTransactionIds = newTransactions.map(
      (transaction): string => transaction.transactionId
    );

    const existingMatchingTransactions = await getExistingMatchingTransactions({
      userId,
      transactionIds: newTransactionIds,
    });

    await updateTransactions(
      newTransactions,
      existingMatchingTransactions,
      userId
    );

    const dailyExpenseReference = firestore
      .collection(CollectionNames.DailyExpense)
      .doc(userId) as DocumentReference<Collections.DailyExpense.Entity>;

    await dailyExpenseReference.set({
      balances: nordigenBalances.balances.map((balance) =>
        makeBalance(balance)
      ),
    });

    await setJobComplete({
      syncJobDocumentReference,
      transactions: newTransactions.map(
        (transaction): string => transaction.transactionId
      ),
    });
  } catch (error: any) {
    if (
      error.status_code === 400 &&
      error.message &&
      error.message.includes("End User Agreement (EUA)") &&
      error.message.includes("has expired")
    ) {
      logError("The account requisition has ended", {
        userId,
        error: JSON.stringify(error),
        message: error.message,
      });
      await setRequisitionExpired({ userId });
    } else {
      logError("Error occurred", {
        userId,
        error: JSON.stringify(error),
        message: error.message,
      });
    }

    await setJobFailed({
      syncJobDocumentReference,
      errorMessage: error.message,
    });
  }
};
