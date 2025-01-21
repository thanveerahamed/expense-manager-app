import {Collections} from '@expense-manager/schema';

export type AmountValue = { amount: number; currency: string };

export interface LabelWithId extends Collections.Labels.Entity {
    id: string;
}

export interface LabelWithAmount {
    label: Collections.Labels.LabelWithId;
    amount: AmountValue;
}
