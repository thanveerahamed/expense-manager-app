import { firestore } from '../firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';
import { getTransactionDocumentsBetweenDates } from '../transactions';
import { FieldPath } from '@google-cloud/firestore';
import { LabelWithAmount, TransactionFilters } from './types';
import { getDurationForTheYear, getMonths } from '../months';
import dayjs from 'dayjs';

const sortAmountDescending = (
  first: LabelWithAmount,
  second: LabelWithAmount,
) => (first.amount.amount > second.amount.amount ? -1 : 1);

export const getLabels = async ({
  userId,
}: {
  userId: string;
}): Promise<Collections.Labels.LabelWithId[]> => {
  const snapshots = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Labels)
    .orderBy(new FieldPath('name'), 'asc')
    .get();

  return snapshots.docs.map(
    (document): Collections.Labels.LabelWithId => ({
      id: document.id,
      name: document.data().name,
      createdAt: document.data().createdAt,
    }),
  );
};

const getTransactions = async ({
  userId,
  startDate,
  endDate,
}: Required<Omit<TransactionFilters, 'id'>>) => {
  return getTransactionDocumentsBetweenDates(userId, startDate!, endDate!);
};

export const getLabelsWithExpenseAmountExpenseAmount = async ({
  userId,
  startDate: filterStartDate,
  endDate: filterEndDate,
  id: monthId,
}: TransactionFilters): Promise<LabelWithAmount[]> => {
  const allLabels = await getLabels({ userId });
  const userLabels = monthId
    ? allLabels.filter((lbl) => lbl.id === monthId)
    : allLabels;
  let startDate: string | undefined = filterStartDate;
  let endDate: string | undefined = filterEndDate;

  if (startDate === undefined || endDate === undefined) {
    const months = await getMonths(userId);
    const duration = getDurationForTheYear(dayjs().format('YYYY'), months);
    startDate = duration.startDate;
    endDate = duration.endDate;
  }

  const transactions = await getTransactions({
    userId,
    startDate: startDate,
    endDate: endDate,
  });

  if (transactions === undefined) {
    return [];
  }

  const labelsWithAmount = transactions.reduce(
    (previousValue: LabelWithAmount[], doc): LabelWithAmount[] => {
      const transaction = doc.data() as Collections.Transactions.Entity;
      if (transaction === undefined) {
        return previousValue;
      }

      const hasLabel =
        transaction.labels !== undefined && transaction.labels.length > 0;

      if (!hasLabel) {
        return previousValue;
      }

      let intermediatePreviousValue: LabelWithAmount[] = previousValue;

      const transactionLabels = transaction.labels;
      for (const transactionLabel of transactionLabels) {
        const matchingUserLabel = userLabels.find(
          (label) => label.id === transactionLabel.id,
        );

        if (matchingUserLabel === undefined) {
          continue;
        }

        const labelWithAmountFromPreviousValue = intermediatePreviousValue.find(
          (value) => value.label.id === transactionLabel.id,
        );

        if (labelWithAmountFromPreviousValue === undefined) {
          intermediatePreviousValue = [
            ...intermediatePreviousValue,
            {
              label: matchingUserLabel,
              amount: {
                amount: parseFloat(transaction.transactionAmount.amount) * -1,
                currency: transaction.transactionAmount.currency,
              },
            },
          ];
        } else {
          const amountFromPreviousValue =
            labelWithAmountFromPreviousValue.amount.amount;

          intermediatePreviousValue = [
            ...intermediatePreviousValue.filter(
              (value) => value.label.id !== matchingUserLabel.id,
            ),
            {
              label: matchingUserLabel,
              amount: {
                amount:
                  parseFloat(transaction.transactionAmount.amount) * -1 +
                  amountFromPreviousValue,
                currency: transaction.transactionAmount.currency,
              },
            },
          ];
        }
      }

      return intermediatePreviousValue;
    },
    [],
  );

  return labelsWithAmount
    .map((labelWithAmount) => ({
      ...labelWithAmount,
      amount: {
        ...labelWithAmount.amount,
        amount: Number(labelWithAmount.amount.amount.toFixed(2)),
      },
    }))
    .sort(sortAmountDescending);
};
