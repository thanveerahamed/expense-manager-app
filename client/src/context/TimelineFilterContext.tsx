// eslint-disable @typescript-eslint/no-unused-vars
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Collections } from '@expense-manager/schema';

import { generateArrayOfYears } from '../common/helpers';
import { Dayjs, dayjs } from '../common/helpers/dayJs';
import { LabelsView } from '../common/types';
import { UserDemographics } from '../common/types/user';
import { getAllMonths } from '../providers/monthsProvider';

export interface Duration {
  startDate: Dayjs;
  endDate: Dayjs;
}

export interface TimelineFilterContextValue {
  isLoading: boolean;
  duration: Duration;
  movePrevious: () => void;
  moveNext: () => void;
  displayText: string;
  selectedView: string;
  selectedViewChange: (view: string) => void;
  gotToToday: () => void;
  months: Collections.Months.Entity[];
  error: Error | undefined;
}

interface TimelineProviderProps {
  children: ReactNode;
  user?: UserDemographics;
}

export const TimelineFilterContext =
  createContext<TimelineFilterContextValue | null>(null);

const makeDisplayTextForDurationUpdate = (duration: Duration) => {
  return dayjs().isBetween(
    duration.startDate.set('hour', 0).set('minute', 0).set('second', 0),
    duration.endDate.set('hour', 23).set('minute', 59).set('second', 59),
    null,
    '[)',
  )
    ? 'This week'
    : `${duration.startDate.format('DD MMM, YYYY')} - ${duration.endDate.format(
        'DD MMM, YYYY',
      )}`;
};

const makeDisplayTextForMonthUpdate = (month: Collections.Months.Entity) => {
  return dayjs().isBetween(
    month.startDate,
    month.endDate ?? dayjs().add(1, 'day'),
    null,
    '[)',
  )
    ? 'This month'
    : dayjs(month.endDate).format('MMM YYYY');
};

const getDurationForTheYear = (
  year: string,
  months: Collections.Months.Entity[],
): Duration => {
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
      startDate: dayjs(lastMonth.endDate, 'YYYY-MM-DD'),
      endDate: dayjs().add(1, 'day'),
    };
  } else {
    const lastMonth = monthsInSelectedYear[0];
    const firstMonth = monthsInSelectedYear[monthsInSelectedYear.length - 1];

    return {
      startDate: dayjs(firstMonth.startDate, 'YYYY-MM-DD'),
      endDate:
        lastMonth.endDate === undefined
          ? dayjs().add(1, 'day')
          : dayjs(lastMonth.endDate, 'YYYY-MM-DD').subtract(1, 'day'),
    };
  }
};

export const TimelineFilterProvider = ({
  children,
  user,
}: TimelineProviderProps) => {
  const initialDuration: Duration = {
    startDate: dayjs().day(0),
    endDate: dayjs().day(6),
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [months, setMonths] = useState<Collections.Months.Entity[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<
    Collections.Months.Entity | undefined
  >(undefined);

  const lastTenYears = generateArrayOfYears();
  const [availableYears, setAvailableYears] = useState<string[]>(lastTenYears);
  const [selectedYear, setSelectedYear] = useState<string>(lastTenYears[0]);

  const currentWeek = dayjs().week();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setSelectedWeek] = useState<number>(currentWeek);

  const [selectedView, setSelectedView] = useState<string>(LabelsView.Week);

  const [duration, setDuration] = useState<Duration>(initialDuration);

  const [displayText, setDisplayText] = useState<string>(
    makeDisplayTextForDurationUpdate(initialDuration),
  );
  const [error, setError] = useState<Error | undefined>(undefined);

  const getActiveMonthIndex = useCallback(
    (activeMonth: Collections.Months.Entity) =>
      months.findIndex((month) => month.id === activeMonth.id),
    [months],
  );

  const generateAvailableYears = (months: Collections.Months.Entity[]) => {
    const availableYears = months.reduce((years: string[], month): string[] => {
      const year = dayjs(month.startDate, 'YYYY-MM-DD').year().toString();

      if (!years.includes(year)) {
        return [...years, year];
      }

      return years;
    }, []);

    const currentYear = dayjs().year().toString();

    return (
      availableYears.includes(currentYear)
        ? availableYears
        : [...availableYears, currentYear]
    ).sort((yearA, yearB) => (yearA > yearB ? -1 : 1));
  };

  const resetToCurrentWeek = () => {
    setDuration(initialDuration);
    setSelectedWeek(currentWeek);
  };

  const resetToCurrentYear = () => {
    setSelectedYear(availableYears[0]);
    setDuration(getDurationForTheYear(availableYears[0], months));
  };

  const resetToCurrentMonth = () => {
    setSelectedMonth(months[0]);
    if (months[0] !== undefined) {
      setDuration({
        startDate: dayjs(months[0].startDate),
        endDate:
          months[0].endDate === undefined
            ? dayjs().add(1, 'day')
            : dayjs(months[0].endDate).subtract(1, 'day'),
      });
    }
  };

  const handleWeekViewMovePrevious = (newValue: number) => {
    const weekDifference = currentWeek - newValue;
    if (weekDifference > 0) {
      const totalDayDifference = weekDifference * 7;

      setDuration({
        startDate: dayjs().day(0).subtract(totalDayDifference, 'days'),
        endDate: dayjs().day(6).subtract(totalDayDifference, 'days'),
      });
    }
  };

  const handleWeekViewMoveNext = (newValue: number) => {
    const weekDifference = currentWeek - newValue;
    const totalDayDifference = weekDifference * 7;

    setDuration({
      startDate: dayjs().day(0).subtract(totalDayDifference, 'days'),
      endDate: dayjs().day(6).subtract(totalDayDifference, 'days'),
    });
  };

  const handleMonthsMoveNext = (activeMonth: Collections.Months.Entity) => {
    const nextIndex = getActiveMonthIndex(activeMonth) - 1;
    if (nextIndex > -1) {
      const nextMonth = months[nextIndex];
      setDuration({
        startDate: dayjs(nextMonth.startDate, 'YYYY-MM-DD'),
        endDate:
          nextMonth.endDate === undefined
            ? dayjs().add(1, 'day')
            : dayjs(nextMonth.endDate, 'YYYY-MM-DD').subtract(1, 'day'),
      });

      return nextMonth;
    }

    return activeMonth;
  };

  const handleMonthsMovePrevious = (activeMonth: Collections.Months.Entity) => {
    const previousIndex = getActiveMonthIndex(activeMonth) + 1;
    if (previousIndex < months.length) {
      const previousMonth = months[previousIndex];
      setDuration({
        startDate: dayjs(previousMonth.startDate, 'YYYY-MM-DD'),
        endDate:
          previousMonth.endDate === undefined
            ? dayjs().add(1, 'day')
            : dayjs(previousMonth.endDate, 'YYYY-MM-DD').subtract(1, 'day'),
      });

      return previousMonth;
    }

    return activeMonth;
  };

  const handleYearsMoveNext = (previousYear: string) => {
    if (previousYear !== availableYears[0]) {
      const previousIndex = availableYears.indexOf(previousYear);
      const newYear = availableYears[previousIndex - 1];
      setDuration(getDurationForTheYear(newYear, months));
      return newYear;
    }

    return previousYear;
  };

  const handleYearsMovePrevious = (currentYear: string) => {
    if (currentYear !== availableYears[availableYears.length - 1]) {
      const currentIndex = availableYears.indexOf(currentYear);
      const newYear = availableYears[currentIndex + 1];
      setDuration(getDurationForTheYear(newYear, months));
      return newYear;
    }

    return currentYear;
  };

  const handleMovePrevious = () => {
    switch (selectedView) {
      case LabelsView.Week: {
        setSelectedWeek((prevState) => {
          const updatedValue = prevState - 1;
          handleWeekViewMovePrevious(updatedValue);
          return updatedValue;
        });

        break;
      }

      case LabelsView.Month: {
        setSelectedMonth((prevState) => {
          if (prevState !== undefined)
            return handleMonthsMovePrevious(prevState);
        });
        break;
      }

      case LabelsView.Year: {
        setSelectedYear((prevState) => {
          return handleYearsMovePrevious(prevState);
        });
        break;
      }
    }
  };

  const handleMoveNext = () => {
    switch (selectedView) {
      case LabelsView.Week: {
        setSelectedWeek((prevState) => {
          if (prevState === currentWeek) {
            return prevState;
          }

          const updatedValue = prevState + 1;
          handleWeekViewMoveNext(updatedValue);
          return updatedValue;
        });

        break;
      }

      case LabelsView.Month: {
        setSelectedMonth((prevState) => {
          if (prevState !== undefined) return handleMonthsMoveNext(prevState);
        });
        break;
      }

      case LabelsView.Year: {
        setSelectedYear((prevState) => {
          return handleYearsMoveNext(prevState);
        });
        break;
      }
    }
  };

  const handleGoToTodayClick = () => {
    switch (selectedView) {
      case LabelsView.Month:
        resetToCurrentMonth();
        break;

      case LabelsView.Week:
        resetToCurrentWeek();
        break;

      case LabelsView.Year:
        resetToCurrentYear();
        break;

      case LabelsView.Custom:
        break;
    }
  };

  useEffect(() => {
    switch (selectedView) {
      case LabelsView.Week: {
        setDisplayText(makeDisplayTextForDurationUpdate(duration));
        break;
      }

      case LabelsView.Month: {
        if (selectedMonth !== undefined) {
          setDisplayText(makeDisplayTextForMonthUpdate(selectedMonth));
        }
        break;
      }

      case LabelsView.Year: {
        setDisplayText(selectedYear);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  useEffect(() => {
    switch (selectedView) {
      case LabelsView.Week: {
        resetToCurrentWeek();
        break;
      }

      case LabelsView.Month: {
        resetToCurrentMonth();
        break;
      }

      case LabelsView.Year: {
        resetToCurrentYear();
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedView]);

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    (async () => {
      setIsLoading(true);
      try {
        const months = await getAllMonths();
        setMonths(months);
        setSelectedMonth(months[0]);
        setAvailableYears(generateAvailableYears(months));
      } catch (error: any) {
        console.error(error);
        setError(new Error(error));
      }
      setIsLoading(false);
    })();
  }, [user]);

  return (
    <TimelineFilterContext.Provider
      value={{
        isLoading,
        duration,
        movePrevious: handleMovePrevious,
        displayText,
        selectedView,
        moveNext: handleMoveNext,
        selectedViewChange: setSelectedView,
        gotToToday: handleGoToTodayClick,
        months,
        error,
      }}
    >
      {children}
    </TimelineFilterContext.Provider>
  );
};

export const useTimelineFilterContext = (): TimelineFilterContextValue => {
  const context = useContext(TimelineFilterContext);

  if (context === null) {
    throw new Error(
      'useTimelineFilterContext must be used within a TimelineFilterProvider',
    );
  }

  return context;
};
// eslint-enable @typescript-eslint/no-unused-vars
