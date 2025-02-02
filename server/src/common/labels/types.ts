import { Collections } from '@expense-manager/schema';
import { AmountValue } from '../../budgets/budgets.interface';

export interface LabelWithAmount {
  label: Collections.Labels.LabelWithId;
  amount: AmountValue;
}

export enum LabelsView {
  Month = 'month',
  Year = 'year',
  Custom = 'custom',
}

export interface TransactionFilters {
  userId: string;
  id?: string;
  startDate?: string;
  endDate?: string;
}
