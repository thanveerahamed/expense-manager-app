import * as functions from "firebase-functions";
import { logError, logInfo } from "../../common/logger";
import { getAllUsersWithRequisitionAndAccountId } from "../common/syncTransactions/users";
import { DocumentReference, Timestamp } from "@google-cloud/firestore";
import { CollectionNames, Collections } from "@expense-manager/schema";
import { firestore } from "../../common/firebase";

export const syncTransactions = functions
  .region("europe-west1")
  .pubsub.schedule("0 11,23 * * *")
  .timeZone("Europe/Brussels")
  .onRun(async () => {
    logInfo("syncTransactions called");

    try {
      const users = await getAllUsersWithRequisitionAndAccountId();
      logInfo(`${users.length} user(s) obtained`);

      for (const { userId } of users) {
        logInfo("queuing sync transaction for user", { userId });
        const documentReference = firestore
          .collection(CollectionNames.Jobs)
          .doc() as DocumentReference<
          Collections.Jobs.SyncTransactionsJob<Collections.Jobs.JobTypes.SYNC_TRANSACTIONS>
        >;

        const syncTransactionTask: Collections.Jobs.SyncTransactionsJob<Collections.Jobs.JobTypes.SYNC_TRANSACTIONS> =
          {
            userId,
            type: Collections.Jobs.JobTypes.SYNC_TRANSACTIONS,
            createdAt: Timestamp.now(),
          };

        await documentReference.create(syncTransactionTask);
      }
    } catch (error: any) {
      logError("syncTransactions failed", { error });
    }
  });
