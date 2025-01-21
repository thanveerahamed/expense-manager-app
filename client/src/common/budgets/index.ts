import {Collections, Services} from '@expense-manager/schema';

export const getBudgetProgress = (percentage: number): number =>
    percentage > 100 ? 100 : percentage;

export const getBudgetProgressColor = (
    percentage: number,
): 'error' | 'success' | 'warning' => {
    if (percentage > 100) return 'error';

    if (percentage > 85) {
        return 'warning';
    }

    return 'success';
};

export const getRemainingAmountString = (
    overview: Services.Budgets.BudgetOverview,
) => {
    const remainingAmount =
        Number(overview.budget.amount) - Number(overview.expense.amount);

    return `${remainingAmount.toLocaleString()} ${overview.expense.currency}`;
};

export const getRemainingAmount = (
    overview: Services.Budgets.BudgetOverview,
): number => Number(overview.budget.amount) - Number(overview.expense.amount);

export const getTotalAmountString = (
    overview: Services.Budgets.BudgetOverview,
) => Number(overview.budget.amount).toLocaleString();

export const isBudgetValidForCreate = (budget: Services.Budgets.Budget) => {
    if (budget.name === '' || budget.amount === 0) {
        return false;
    }

    if (budget.operator === Collections.Budgets.BudgetCombination.LabelsOnly) {
        return budget.labels.length > 0;
    }

    if (
        budget.operator === Collections.Budgets.BudgetCombination.CategoriesOnly
    ) {
        return budget.categories.length > 0;
    }

    return budget.labels.length > 0 && budget.categories.length > 0;
};
