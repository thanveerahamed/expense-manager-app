export interface BaseCategory {
  id?: string;
  name: string;
  type: string;
  priority: number;
  single?: boolean;
}

export interface OrderedCategory extends BaseCategory {
  children: BaseCategory[];
}

export const singleEntryCategories = ['Savings', 'Transfers', 'Exclude'];

export interface CategoryItem extends BaseCategory {
  parent: string;
}
