import * as functions from "firebase-functions";
import { firestore } from "../../../common/firebase";
import { CollectionNames, Collections } from "@expense-manager/schema";
import { FieldPath } from "@google-cloud/firestore";

const classificationReducer = (
  acc: Collections.Classifications.CategoryClassificationMap[],
  classification: Collections.Classifications.Entity
): Collections.Classifications.CategoryClassificationMap[] => {
  const currentMap = acc.find((a) => a.category === classification.category);

  if (currentMap === undefined) {
    return [
      ...acc,
      {
        category: `${classification.category}_${classification.parent}_${classification.categoryId}`,
        classifications: [classification],
      },
    ];
  } else {
    const deepCopyCategory = { ...currentMap };
    deepCopyCategory.classifications.push(classification);

    return [
      ...acc.filter((a) => a.category !== classification.category),
      deepCopyCategory,
    ];
  }
};

export const updateClassificationWithNewCategory = async ({
  transactionId,
  categoryId,
  userId,
}: {
  transactionId: string;
  categoryId: string;
  userId: string;
}) => {
  const transactionDocumentSnapshot = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Transactions)
    .doc(transactionId)
    .get();

  const transaction =
    transactionDocumentSnapshot.data() as Collections.Transactions.Entity;

  const vendorName = Collections.Transactions.getVendorName(transaction);

  const categorySnapshot = await firestore
    .collection(CollectionNames.Categories)
    .doc(categoryId)
    .get();

  const category: Collections.Category.Entity = {
    ...(categorySnapshot.data() as Collections.Category.Entity),
    id: categorySnapshot.id,
  };

  const classificationSearchSnapshots = await firestore
    .collection(CollectionNames.Classifications)
    .where(new FieldPath("type"), "==", category.type)
    .where(new FieldPath("name"), "==", vendorName)
    .where(
      new FieldPath("code"),
      "==",
      transaction.proprietaryBankTransactionCode
    )
    .get();

  if (classificationSearchSnapshots.size > 0) {
    for (const classificationDocs of classificationSearchSnapshots.docs) {
      await classificationDocs.ref.delete();
    }
  }

  const newClassificationDocumentReference = firestore
    .collection(CollectionNames.Classifications)
    .doc();
  const newClassification: Collections.Classifications.Entity = {
    category: category.name,
    type:
      category.type === "debit"
        ? Collections.Transactions.TransactionType.Debit
        : Collections.Transactions.TransactionType.Credit,
    categoryId,
    name: vendorName,
    parent: category.parent,
    code: transaction.proprietaryBankTransactionCode,
  };

  await newClassificationDocumentReference.create(newClassification);
};

export const regenerateClassificationJson = async ({
  transactionId,
  categoryId,
  userId,
}: {
  transactionId: string;
  categoryId: string;
  userId: string;
}) => {
  functions.logger.info("regenerateClassificationJson called");

  await updateClassificationWithNewCategory({
    transactionId,
    categoryId,
    userId,
  });

  const classificationSnapshots = await firestore
    .collection(CollectionNames.Classifications)
    .get();

  const classifications = classificationSnapshots.docs.map(
    (doc) => doc.data() as Collections.Classifications.Entity
  );

  const debitClassifications = classifications
    .filter((dt) => dt.type === Collections.Transactions.TransactionType.Debit)
    .reduce(classificationReducer, []);

  const creditClassification = classifications
    .filter((dt) => dt.type === Collections.Transactions.TransactionType.Credit)
    .reduce(classificationReducer, []);

  const creditDocReference = firestore
    .collection(CollectionNames.Classifier)
    .doc(Collections.Transactions.TransactionType.Credit);
  const debitDocReference = firestore
    .collection(CollectionNames.Classifier)
    .doc(Collections.Transactions.TransactionType.Debit);

  await firestore
    .batch()
    .set(creditDocReference, { json: JSON.stringify(creditClassification) })
    .set(debitDocReference, { json: JSON.stringify(debitClassifications) })
    .commit();

  functions.logger.info("regenerateClassificationJson completed");
};
