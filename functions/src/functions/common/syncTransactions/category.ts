import { getCategoryClassification } from "../../../common/classifier";
import { firestore } from "../../../common/firebase";
import { CollectionNames, Collections } from "@expense-manager/schema";

export const getClassifiedCategory = async (
  type: string,
  name: string
): Promise<Collections.Category.Entity> => {
  const categoryString = await getCategoryClassification(type, name);
  const classifiedCategoryId = categoryString.split("_")[2];
  const categoryDocument = await firestore
    .collection(CollectionNames.Categories)
    .doc(classifiedCategoryId)
    .get();
  return {
    ...categoryDocument.data(),
    id: classifiedCategoryId,
  } as Collections.Category.Entity;
};
