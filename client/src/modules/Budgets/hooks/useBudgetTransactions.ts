import { useCallback, useEffect, useState } from 'react';

import { Collections, Services } from '@expense-manager/schema';

import { getBudgetTransactions } from '../../../providers';
import { getAllMonths } from '../../../providers/monthsProvider';

export const useBudgetTransactions = (budgetId?: string) => {
  const [months, setMonths] = useState<Collections.Months.Entity[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<
    Collections.Months.Entity | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<
    Services.Transactions.Transaction[]
  >([]);
  const [budgetOverview, setBudgetOverview] = useState<
    Services.Budgets.BudgetOverview | undefined
  >(undefined);

  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (budgetId === undefined) {
      setError(new Error('budgetId is undefined'));
      return;
    }

    (async () => {
      setIsInitialLoading(true);
      try {
        const response = await getAllMonths();
        setMonths(response);
        setSelectedMonth(response[0]);
      } catch (error: any) {
        console.error(error);
        setError(new Error(error));
      }
      setIsInitialLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBudgetTransactions = useCallback(() => {
    if (budgetId === undefined || selectedMonth === undefined) {
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const response = await getBudgetTransactions(budgetId, selectedMonth);
        setTransactions(response.transactions);
        setBudgetOverview(response.overview);
      } catch (error: any) {
        console.error(error);
        setError(new Error(error));
      }
      setIsLoading(false);
    })();
  }, [budgetId, selectedMonth]);

  useEffect(() => {
    loadBudgetTransactions();
  }, [selectedMonth, budgetId, loadBudgetTransactions]);

  return {
    transactions,
    isLoading,
    error,
    months,
    selectedMonth,
    setSelectedMonth,
    isInitialLoading,
    budgetOverview,
    loadBudgetTransactions,
  };
};
