import { firestore } from '../firebase';
import { CollectionNames, Collections } from '@expense-manager/schema';
import {
  DocumentSnapshot,
  FieldPath,
  QuerySnapshot,
} from '@google-cloud/firestore';
import moment from 'moment';
import dayjs from 'dayjs';

export const getCurrentMonth = async (
  userId: string,
): Promise<Collections.Months.Entity | undefined> => {
  const currentMonthSnapshots = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Months)
    .where(new FieldPath('current'), '==', true)
    .get()) as QuerySnapshot<Collections.Months.Entity>;

  const currentMonth = currentMonthSnapshots.docs[0].data();

  if (
    currentMonthSnapshots.size === 0 ||
    currentMonthSnapshots.empty ||
    currentMonth === undefined
  ) {
    return undefined;
  }

  return {
    ...currentMonth,
    endDate: moment().format('YYYY-MM-DD'), // today
  };
};

export const getMonthById = async ({
  userId,
  id,
}: {
  userId: string;
  id: string;
}): Promise<Collections.Months.Entity | undefined> => {
  const monthSnapShot = (await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Months)
    .doc(id)
    .get()) as DocumentSnapshot<Collections.Months.Entity>;

  const month = monthSnapShot.data();

  if (!monthSnapShot.exists || month === undefined) {
    return undefined;
  }

  return month;
};

export const getMonths = async (
  userId: string,
): Promise<Collections.Months.Entity[]> => {
  const snapshots = await firestore
    .collection(CollectionNames.DailyExpense)
    .doc(userId)
    .collection(CollectionNames.Months)
    .orderBy(new FieldPath('startDate'), 'desc')
    .get();

  return snapshots.docs.map((document) => ({
    ...(document.data() as Collections.Months.Entity),
    id: document.id,
  }));
};

export const getDurationForTheYear = (
  year: string,
  months: Collections.Months.Entity[],
): { startDate: string; endDate: string } => {
  const monthsInSelectedYear = months.filter(
    (month) => month.endDate !== undefined && month.endDate.indexOf(year) > -1,
  );

  if (monthsInSelectedYear.length === 0) {
    const previousYear = (Number(year) - 1).toString();
    const monthsInPreviousYear = months.filter(
      (month) =>
        month.endDate !== undefined && month.endDate.indexOf(previousYear) > -1,
    );

    const lastMonth = monthsInPreviousYear[0];

    return {
      startDate:
        lastMonth.endDate ?? dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    };
  } else {
    const lastMonth = monthsInSelectedYear[0];
    const firstMonth = monthsInSelectedYear[monthsInSelectedYear.length - 1];

    return {
      startDate: firstMonth.startDate,
      endDate:
        lastMonth.endDate === undefined
          ? dayjs().add(1, 'day').format('YYYY-MM-DD')
          : dayjs(lastMonth.endDate, 'YYYY-MM-DD')
              .subtract(1, 'day')
              .format('YYYY-MM-DD'),
    };
  }
};
