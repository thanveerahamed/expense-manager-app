import { OrderedCategory } from './category.interface';
import { firestore } from '../common/firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';

const memory = new Map();

const sortFunction = (number1: number, number2: number) =>
  number1 > number2 ? 1 : -1;

export const getAllCategories = async (): Promise<OrderedCategory[]> => {
  const categoriesFromCache = memory.get('categories');

  if (categoriesFromCache !== undefined) {
    return categoriesFromCache;
  }

  const categorySnapshots = await firestore
    .collection(CollectionNames.Categories)
    .get();

  const categories = categorySnapshots.docs
    .reduce(
      (
        previousValues: OrderedCategory[],
        currentDocument,
      ): OrderedCategory[] => {
        const currentValue = {
          ...(currentDocument.data() as Collections.Category.Entity),
          id: currentDocument.id,
        };
        const existingValue = previousValues.find(
          (value) =>
            value.name === currentValue.parent &&
            value.type === currentValue.type,
        );

        if (existingValue === undefined) {
          return [
            ...previousValues,
            {
              name: currentValue.parent,
              type: currentValue.type,
              priority: currentValue.parentPriority,
              single: true,
              children: [currentValue],
            },
          ];
        }

        const currentChild = {
          id: currentValue.id,
          name: currentValue.name,
          priority: currentValue.priority,
          type: currentValue.type,
          parent: currentValue.parent,
          parentPriority: currentValue.parentPriority,
        };
        const currentCategory: OrderedCategory = {
          name: existingValue.name,
          type: existingValue.type,
          priority: existingValue.priority,
          single: false,
          children: [...existingValue.children],
        };
        currentCategory.children.push(currentChild);
        currentCategory.children.sort((category1, category2) =>
          sortFunction(category1.priority, category2.priority),
        );

        return [
          ...previousValues.filter(
            (value) => value.name !== existingValue.name,
          ),
          currentCategory,
        ];
      },
      [],
    )
    .sort((category1, category2) =>
      sortFunction(category1.priority, category2.priority),
    );

  memory.set('categories', categories);

  return categories;
};
