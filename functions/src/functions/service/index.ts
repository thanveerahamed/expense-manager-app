import * as functions from "firebase-functions";
import { firestore } from "../../common/firebase";
import { CollectionNames } from "@expense-manager/schema";

export const service = functions.https.onRequest(async (request, response) => {
  functions.logger.info("service called", {
    structuredData: true,
  });

  const userId = functions.config().test_data.user_id;

  try {
    const transactionsSnapshots = await firestore
      .collection(CollectionNames.DailyExpense)
      .doc(userId)
      .collection(CollectionNames.Transactions)
      .limit(10)
      .get();

    for (const doc of transactionsSnapshots.docs) {
      try {
        console.log(doc.id, doc.data());
      } catch (e) {
        console.error(e);
      }
    }

    response.send();
  } catch (e) {
    response.send(e);
  }
});
