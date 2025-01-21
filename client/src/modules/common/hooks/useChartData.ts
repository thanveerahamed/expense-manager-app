import {useMemo} from 'react';

import {Collections, Services} from '@expense-manager/schema';

import {Duration} from '../../../context/TimelineFilterContext';

import {Dayjs, dayjs} from '../../../common/helpers/dayJs';
import {isExcludedCategoryTransaction} from '../../../common/transactions';
import {LabelsView} from '../../../common/types';

interface Props {
    duration: Duration;
    transactions: Services.Transactions.Transaction[];
    selectedView: string;
    months: Collections.Months.Entity[];
}

const generateChartDataForWeekView = ({
                                          beginDate,
                                          finishDate,
                                          transactions,
                                      }: {
    beginDate: Dayjs;
    finishDate: Dayjs;
    transactions: Services.Transactions.Transaction[];
}) => {
    const initialBeginDate = beginDate;
    const labels: string[] = [];
    const debitSeries = [];
    const creditSeries = [];
    while (beginDate <= finishDate) {
        labels.push(beginDate.format('DD MMM'));

        if (beginDate > dayjs()) {
            if (beginDate.diff(initialBeginDate, 'day') === 1) {
                debitSeries.push(0);
                creditSeries.push(0);
            } else {
                debitSeries.push(null);
                creditSeries.push(null);
            }
        } else {
            const transactionAmountForCurrentDate = transactions
                .filter(
                    // eslint-disable-next-line no-loop-func
                    (transaction) =>
                        transaction.bookingDate === beginDate.format('YYYY-MM-DD') &&
                        !isExcludedCategoryTransaction(transaction),
                )
                .reduce(
                    (accumulator, transaction): { credit: number; debit: number } => {
                        if (
                            transaction.type ===
                            Collections.Transactions.TransactionType.Credit
                        ) {
                            return {
                                debit: accumulator.debit,
                                credit: accumulator.credit + Number(transaction.amount),
                            };
                        }

                        return {
                            debit: accumulator.debit + Number(transaction.amount),
                            credit: accumulator.credit,
                        };
                    },
                    {
                        debit: 0,
                        credit: 0,
                    },
                );

            debitSeries.push(
                Number((transactionAmountForCurrentDate.debit * -1).toFixed(2)),
            );
            creditSeries.push(
                Number(transactionAmountForCurrentDate.credit.toFixed(2)),
            );
        }

        beginDate = beginDate.add(1, 'day');
    }

    return {
        series: [
            {data: debitSeries, name: 'debit'},
            {data: creditSeries, name: 'credit'},
        ],
        labels,
    };
};

const getWeeksForTheMonth = ({
                                 beginDate,
                                 finishDate,
                             }: {
    beginDate: Dayjs;
    finishDate: Dayjs;
}): Duration[] => {
    const weeklyDurations: Duration[] = [];
    let startDate = beginDate;
    let isEnd = false;
    while (!isEnd) {
        let endDate = startDate.add(6, 'days');
        let newStartDate = startDate.add(7, 'days');

        if (endDate > finishDate) {
            endDate = finishDate;
            isEnd = true;
        }

        weeklyDurations.push({
            startDate,
            endDate,
        });

        startDate = newStartDate;
    }

    return weeklyDurations;
};

const generateChartDataForMonthView = ({
                                           beginDate,
                                           finishDate,
                                           transactions,
                                       }: {
    beginDate: Dayjs;
    finishDate: Dayjs;
    transactions: Services.Transactions.Transaction[];
}) => {
    const debitSeries = [];
    const creditSeries = [];
    const weeks = getWeeksForTheMonth({beginDate, finishDate});
    const labels: string[] = [];
    for (const week of weeks) {
        if (week.startDate.month() !== week.endDate.month()) {
            labels.push(
                `${week.startDate.format('DD/MM')}-${week.endDate.format('DD/MM')}`,
            );
        } else {
            labels.push(
                `${week.startDate.format('DD')}-${week.endDate.format('DD')}`,
            );
        }

        const transactionAmountForCurrentWeek = transactions
            .filter(
                // eslint-disable-next-line no-loop-func
                (transaction) =>
                    dayjs(transaction.bookingDate, 'YYYY-MM-DD').isBetween(
                        week.startDate.set('hour', 0).set('minute', 0).set('second', 0),
                        week.endDate.set('hour', 23).set('minute', 59).set('second', 59),
                        null,
                        '[)',
                    ) && !isExcludedCategoryTransaction(transaction),
            )
            .reduce(
                (accumulator, transaction): { credit: number; debit: number } => {
                    if (
                        transaction.type === Collections.Transactions.TransactionType.Credit
                    ) {
                        return {
                            debit: accumulator.debit,
                            credit: accumulator.credit + Number(transaction.amount),
                        };
                    }

                    return {
                        debit: accumulator.debit + Number(transaction.amount),
                        credit: accumulator.credit,
                    };
                },
                {
                    debit: 0,
                    credit: 0,
                },
            );

        debitSeries.push(
            Number((transactionAmountForCurrentWeek.debit * -1).toFixed(2)),
        );
        creditSeries.push(
            Number(transactionAmountForCurrentWeek.credit.toFixed(2)),
        );
    }

    return {
        series: [
            {data: debitSeries, name: 'debit'},
            {data: creditSeries, name: 'credit'},
        ],
        labels,
    };
};

const generateChartDataForYearView = ({
                                          beginDate,
                                          finishDate,
                                          transactions,
                                          months,
                                      }: {
    beginDate: Dayjs;
    finishDate: Dayjs;
    transactions: Services.Transactions.Transaction[];
    months: Collections.Months.Entity[];
}) => {
    const debitSeries = [];
    const creditSeries = [];
    const labels: string[] = [];
    const monthsForTheYear = months
        .filter(
            (month) =>
                dayjs(month.startDate, 'YYYY-MM-DD').isBetween(
                    beginDate,
                    finishDate,
                    null,
                    '[)',
                ) ||
                dayjs(month.startDate, 'YYYY-MM-DD').isBetween(
                    beginDate,
                    finishDate,
                    null,
                    '[)',
                ),
        )
        .reverse();

    for (const month of monthsForTheYear) {
        labels.push(
            `${
                month.endDate === undefined
                    ? dayjs().add(1, 'day').format('MMM')
                    : dayjs(month.endDate, 'YYYY-MM-DD').format('MMM')
            }`,
        );

        const transactionAmountForMonth = transactions
            .filter(
                // eslint-disable-next-line no-loop-func
                (transaction) =>
                    dayjs(transaction.bookingDate, 'YYYY-MM-DD').isBetween(
                        dayjs(month.startDate, 'YYYY-MM-DD')
                            .set('hour', 0)
                            .set('minute', 0)
                            .set('second', 0),
                        dayjs(month.endDate, 'YYYY-MM-DD')
                            .set('hour', 23)
                            .set('minute', 59)
                            .set('second', 59),
                        null,
                        '[)',
                    ) && !isExcludedCategoryTransaction(transaction),
            )
            .reduce(
                (accumulator, transaction): { credit: number; debit: number } => {
                    if (
                        transaction.type === Collections.Transactions.TransactionType.Credit
                    ) {
                        return {
                            debit: accumulator.debit,
                            credit: accumulator.credit + Number(transaction.amount),
                        };
                    }

                    return {
                        debit: accumulator.debit + Number(transaction.amount),
                        credit: accumulator.credit,
                    };
                },
                {
                    debit: 0,
                    credit: 0,
                },
            );

        debitSeries.push(Number((transactionAmountForMonth.debit * -1).toFixed(2)));
        creditSeries.push(Number(transactionAmountForMonth.credit.toFixed(2)));
    }

    return {
        series: [
            {data: debitSeries, name: 'debit'},
            {data: creditSeries, name: 'credit'},
        ],
        labels,
    };
};

export const useChartData = ({
                                 duration,
                                 transactions,
                                 selectedView,
                                 months,
                             }: Props) => {
    const chartData = useMemo(() => {
        let beginDate = duration.startDate;
        let finishDate = duration.endDate;

        switch (selectedView) {
            case LabelsView.Month:
                return generateChartDataForMonthView({
                    beginDate,
                    finishDate,
                    transactions,
                });

            case LabelsView.Week:
                return generateChartDataForWeekView({
                    beginDate,
                    finishDate,
                    transactions,
                });

            case LabelsView.Year:
                return generateChartDataForYearView({
                    beginDate,
                    finishDate,
                    months,
                    transactions,
                });

            default: {
                return {
                    series: [],
                    labels: [],
                };
            }
        }
    }, [
        duration.endDate,
        duration.startDate,
        months,
        selectedView,
        transactions,
    ]);

    return {
        chartData,
    };
};
