import * as functions from "firebase-functions";
import { CollectionNames, Collections } from "@expense-manager/schema";
import { regenerateClassificationJson } from "../common/regenerateClassification";
import { getAccountId } from "../common/syncTransactions/users";
import { logInfo } from "../../common/logger";
import { syncTransactions } from "../common/syncTransactions";

export const processJobs = functions
  .runWith({
    timeoutSeconds: 500,
  })
  .region("europe-west1")
  .firestore.document(`${CollectionNames.Jobs}/{docId}`)
  .onCreate(async (snapshot) => {
    functions.logger.info("processJobs called");

    const type = snapshot.data().type as Collections.Jobs.JobTypes;

    if (type === Collections.Jobs.JobTypes.REGENERATE_CLASSIFICATIONS) {
      const { userId, categoryId, transactionId } =
        snapshot.data() as Collections.Jobs.RegenerateClassification<Collections.Jobs.JobTypes.REGENERATE_CLASSIFICATIONS>;
      await regenerateClassificationJson({ userId, categoryId, transactionId });
    }

    if (type === Collections.Jobs.JobTypes.SYNC_TRANSACTIONS) {
      const userId = snapshot.data().userId;
      const accountId = await getAccountId({ userId });

      if (accountId === undefined) {
        logInfo("No account found for the user", { userId });
        return;
      }

      await syncTransactions({ userId, accountId });
    }

    functions.logger.info("processJobs completed");
  });
