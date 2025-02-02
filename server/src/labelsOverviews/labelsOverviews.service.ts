import { getLabelsWithExpenseAmountExpenseAmount } from '../common/labels';
import { TransactionFilters } from '../common/labels/types';

export const getLabelsOverviews = async (request: TransactionFilters) => {
  const { userId, startDate, endDate } = request;
  return getLabelsWithExpenseAmountExpenseAmount({
    endDate,
    startDate,
    userId,
  });
};
