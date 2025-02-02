import {
  getNewTransactionsFromFirestore,
  getTransactions,
  setNewRecordToOldRecord,
} from '../common/transactions';
import { getBudgetsOverviews } from '../common/budgets';
import { GetDashboardDataResponse } from './dashboard.interface';
import { defaultMoneyValue, getAccountBalance } from '../common/balances';
import { getAccountSetupInformation } from '../common/thirdParty/nordigen/setup';
import { getLabelsWithExpenseAmountExpenseAmount } from '../common/labels';
import { getLatestJob } from '../common/jobs';

export const getDashboardData = async (
  userId: string,
): Promise<GetDashboardDataResponse> => {
  const accountSetup = await getAccountSetupInformation(userId);

  if (!accountSetup.isSetup) {
    return {
      isAccountSetup: false,
      transactions: [],
      budgetOverviews: [],
      balance: defaultMoneyValue,
    };
  }

  const [
    getTransactionResponse,
    getBudgetOverviews,
    balance,
    lastSyncTransactionsJob,
  ] = await Promise.all([
    getTransactions({ userId, limit: 3 }),
    getBudgetsOverviews({ userId, limit: 3 }),
    getAccountBalance({ userId }),
    getLatestJob(userId),
  ]);

  return {
    isAccountSetup: true,
    isRequisitionExpired: accountSetup.isExpired,
    isRequisitionFailed: accountSetup.isFailed,
    transactions: getTransactionResponse.transactions,
    budgetOverviews: getBudgetOverviews.budgets,
    balance,
    lastSyncTransactionsJob,
  };
};

export const getDashboardLabelsData = async (userId: string) => {
  return await getLabelsWithExpenseAmountExpenseAmount({
    userId,
  });
};

export const getNewTransactions = async (userId: string) => {
  return getNewTransactionsFromFirestore({ userId });
};

export const makeTransactionOld = async (input: {
  userId: string;
  transactionId: string;
}) => {
  return setNewRecordToOldRecord(input);
};
