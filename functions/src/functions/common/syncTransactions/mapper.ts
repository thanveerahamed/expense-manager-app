import { Collections, Services } from "@expense-manager/schema";
import { Timestamp } from "@google-cloud/firestore";

export const makeBalance = (
  balance: Services.BankingApi.Balance
): Collections.DailyExpense.Balance => {
  const { balanceAmount, balanceType, lastChangeDateTime } = balance;
  return {
    balanceAmount,
    balanceType,
    lastChangeDateTime: Timestamp.fromDate(new Date(lastChangeDateTime)),
  };
};
