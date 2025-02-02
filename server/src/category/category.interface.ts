import { Collections } from '@expense-manager/schema';

export interface Base
  extends Omit<
    Collections.Category.Entity,
    'id' | 'parent' | 'parentPriority'
  > {
  single: boolean;
}

export interface OrderedCategory extends Base {
  children: Collections.Category.Entity[];
}
