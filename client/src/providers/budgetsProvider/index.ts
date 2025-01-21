import {Collections, Services} from '@expense-manager/schema';

import {apiDelete, apiGet, apiPost, apiPut} from '../common';
import {HOST_URL} from '../common/constants';

const budgetUrl = `${HOST_URL}/budgets`;

export const getBudgetOverviews = async (month?: Collections.Months.Entity) => {
    const request: Services.Budgets.GetBudgetsOverviewsRequest = {
        month,
    };
    const getAllUrl = `${budgetUrl}/all`;
    return apiPost<Services.Budgets.GetBudgetsOverviews>(getAllUrl, request);
};

export const createBudget = async (budget: Services.Budgets.Budget) => {
    let updatedBudget = budget;
    if (
        budget.operator === Collections.Budgets.BudgetCombination.CategoriesOnly
    ) {
        updatedBudget = {
            ...budget,
            labels: [],
        };
    } else if (
        budget.operator === Collections.Budgets.BudgetCombination.LabelsOnly
    ) {
        updatedBudget = {
            ...budget,
            categories: [],
        };
    }

    const createUrl = `${budgetUrl}`;
    return apiPost<Services.Budgets.Budget>(createUrl, {budget: updatedBudget});
};

export const updateBudget = async (budget: Services.Budgets.Budget) => {
    let updatedBudget = budget;
    if (
        budget.operator === Collections.Budgets.BudgetCombination.CategoriesOnly
    ) {
        updatedBudget = {
            ...budget,
            labels: [],
        };
    } else if (
        budget.operator === Collections.Budgets.BudgetCombination.LabelsOnly
    ) {
        updatedBudget = {
            ...budget,
            categories: [],
        };
    }

    const createUrl = `${budgetUrl}`;
    return apiPut<Services.Budgets.Budget>(createUrl, {budget: updatedBudget});
};

export const getBudget = async (id: string) => {
    const getBudgetUrl = `${budgetUrl}/${id}`;
    return apiGet<{ budget: Services.Budgets.Budget }>(getBudgetUrl);
};

export const getBudgetTransactions = async (
    id: string,
    month: Collections.Months.Entity,
) => {
    const getBudgetTransactionsUrl = `${budgetUrl}/${id}/transactions`;
    return apiPost<{
        overview: Services.Budgets.BudgetOverview;
        transactions: Services.Transactions.Transaction[];
    }>(getBudgetTransactionsUrl, {month});
};

export const deleteBudget = async (id: string) => {
    const deleteBudgetUrl = `${budgetUrl}/${id}`;
    return apiDelete<{ budget: Services.Budgets.Budget }>(deleteBudgetUrl);
};
