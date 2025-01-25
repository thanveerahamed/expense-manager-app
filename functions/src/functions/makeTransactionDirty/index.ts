import * as functions from "firebase-functions";
import { CollectionNames, Collections } from "@expense-manager/schema";
import { firestore } from "../../common/firebase";
import { FieldPath } from "@google-cloud/firestore";

export const makeTransactionDirty = functions
  .runWith({
    timeoutSeconds: 500,
  })
  .region("europe-west1")
  .firestore.document(
    `${CollectionNames.DailyExpense}/{userId}/${CollectionNames.Transactions}/{docId}`
  )
  .onUpdate(async (change, context) => {
    const newValue = change.after.data() as Collections.Transactions.Entity;
    const previousValue =
      change.before.data() as Collections.Transactions.Entity;

    const { userId, docId } = context.params;

    if (newValue.dirty || previousValue.dirty) {
      return;
    }

    const isDirty =
      newValue.category.id !== previousValue.category.id ||
      newValue.creditorName !== previousValue.creditorName ||
      JSON.stringify(newValue.labels) !==
        JSON.stringify(previousValue.labels) ||
      newValue.transactionAmount.amount !==
        previousValue.transactionAmount.amount ||
      newValue.notes !== previousValue.notes ||
      newValue.dirty !== previousValue.dirty;

    if (isDirty) {
      const transactionReference = firestore
        .collection(CollectionNames.DailyExpense)
        .doc(userId)
        .collection(CollectionNames.Transactions)
        .doc(docId);

      await firestore
        .batch()
        .update(
          transactionReference,
          new FieldPath("dirty"),
          true,
          new FieldPath("newRecord"),
          false
        )
        .commit();

      functions.logger.info("makeTransactionDirty completed", { docId });
    }
  });
