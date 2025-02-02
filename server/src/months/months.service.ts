import { Collections } from '@expense-manager/schema';
import { getMonths as getAllMonths } from '../common/months';

export const getMonths = async (
  userId: string,
): Promise<Collections.Months.Entity[]> => {
  return getAllMonths(userId);
};
