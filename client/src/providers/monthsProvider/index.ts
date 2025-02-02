import { Collections } from '@expense-manager/schema';

import { apiGet } from '../common';
import { HOST_URL } from '../common/constants';

const monthsUrl = `${HOST_URL}/months`;

export const getAllMonths = async (): Promise<Collections.Months.Entity[]> => {
  const getAllMonthsUrl = `${monthsUrl}/all`;
  return apiGet<Collections.Months.Entity[]>(getAllMonthsUrl);
};
