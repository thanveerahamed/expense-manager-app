import {useEffect, useState} from 'react';

import {Collections} from '@expense-manager/schema';
import dayjs, {Dayjs} from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

import {generateArrayOfYears} from '../../../../common/helpers';
import {LabelsView} from '../../../../common/types';
import {getAllMonths} from '../../../../providers/monthsProvider';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const DATE_FORMAT = 'YYYY-MM-DD';

export const useFilters = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [months, setMonths] = useState<Collections.Months.Entity[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<
        Collections.Months.Entity | undefined
    >(undefined);

    const lastTenYears = generateArrayOfYears();
    const [years] = useState<string[]>(lastTenYears);
    const [selectedYear, setSelectedYear] = useState<string>(lastTenYears[0]);

    const currentWeek = dayjs().week();
    const [selectedWeek, setSelectedWeek] = useState<number>(currentWeek);

    const [selectedView, setSelectedView] = useState<string>(LabelsView.Week);

    const [duration, setDuration] = useState<{
        startDate: Dayjs;
        endDate: Dayjs;
    }>({startDate: dayjs().day(0), endDate: dayjs().day(6)});

    const [displayText, setDisplayText] = useState<string>(
        `${duration.startDate.format('DD MMM, YYYY')} - ${duration.endDate.format(
            'DD MMM, YYYY',
        )}`,
    );
    const [error, setError] = useState<Error | undefined>(undefined);

    const handleDateRangeChange = (value: {
        startDate: Dayjs;
        endDate: Dayjs;
    }) => {
        setDuration(value);
    };

    const handleClickPrevious = () => {
        switch (selectedView) {
            case LabelsView.Week: {
                setSelectedWeek((previousValue) => previousValue - 1);
                break;
            }
        }
    };

    useEffect(() => {
        const difference = currentWeek - selectedWeek;
        if (difference > 0) {
            setDuration({
                startDate: dayjs().day(0).subtract(7),
                endDate: dayjs().day(6).subtract(7),
            });
        } else {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedWeek]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const months = await getAllMonths();
                setMonths(months);
                setSelectedMonth(months[0]);
            } catch (error: any) {
                console.error(error);
                setError(new Error(error));
            }
            setIsLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        switch (selectedView) {
            case LabelsView.Year:
                setDuration({
                    startDate: dayjs(`${selectedYear}-01-01`, selectedView),
                    endDate: dayjs(`${selectedYear}-12-31`, selectedView),
                });
                setDisplayText(selectedYear);
                break;

            case LabelsView.Month:
                const payload = {
                    startDate: dayjs(selectedMonth?.startDate, DATE_FORMAT),
                    endDate:
                        selectedMonth?.endDate !== undefined
                            ? dayjs(selectedMonth.endDate).subtract(1, 'day')
                            : dayjs(),
                };
                setDuration(payload);
                setDisplayText(payload.endDate.format('MMM YYYY'));
                break;

            case LabelsView.Week:
            case LabelsView.Custom:
                setDuration({startDate: dayjs().day(0), endDate: dayjs().day(6)});
                setDisplayText(
                    `${duration.startDate.format('DD MMM')} - ${duration.endDate.format(
                        'DD MMM',
                    )}`,
                );
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedView]);

    return {
        isLoading,
        error,
        selectedView,
        setSelectedView,
        years,
        selectedYear,
        setSelectedYear,
        months,
        selectedMonth,
        setSelectedMonth,
        duration,
        handleDateRangeChange,
        displayText,
        handleClickPrevious,
    };
};
