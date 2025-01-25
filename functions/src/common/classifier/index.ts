import { firestore } from "../firebase";
// @ts-expect-error: there are no type for bayes
import * as Bayes from "bayes";
import { CollectionNames, Collections } from "@expense-manager/schema";

const memory = new Map();

export const getCategoryClassification = async (
  type: string,
  name: string
): Promise<string> => {
  const existingClassification = memory.get(type);
  let category: string;
  if (existingClassification === undefined) {
    const bayes = Bayes();

    const classificationJson = (
      await firestore.collection(CollectionNames.Classifier).doc(type).get()
    ).data() as { json: string };

    const currentMap = JSON.parse(
      classificationJson.json
    ) as Collections.Classifications.CategoryClassificationMap[];

    for (const data of currentMap) {
      await bayes.learn(
        data.classifications
          .map(
            (t: Collections.Classifications.Entity) =>
              String(t.name).toLowerCase() + ", " + t.code.toLowerCase()
          )
          .join(", "),
        data.category
      );
    }

    category = await bayes.categorize(name.toLowerCase());
    memory.set(type, { bayes });
  } else {
    category = await existingClassification.bayes.categorize(
      name.toLowerCase()
    );
  }

  return category;
};
