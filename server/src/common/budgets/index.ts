import { Collections, Services } from '@expense-manager/schema';
import { AmountValue } from '../../budgets/budgets.interface';
import { calculatePercentage } from './budgetOverview';

export * from './budgetOverview';
export * from './expense';
export * from './transactions';

export const makeResponse = (
  budget: Collections.Budgets.Entity,
  expenseAmount: AmountValue,
  id: string,
): Services.Budgets.BudgetOverview => {
  const percentage = calculatePercentage(budget.amount, expenseAmount.amount);

  return {
    id,
    budget: {
      amount: budget.amount.toString(),
      currency: expenseAmount.currency,
    },
    name: budget.name,
    expense: {
      amount: Math.round(expenseAmount.amount).toString(),
      currency: expenseAmount.currency,
    },
    percentage,
  };
};
