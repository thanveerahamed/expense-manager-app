import dayjs, {Dayjs} from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(isBetween);

export {dayjs, Dayjs};

export const isDateInThisWeek = ({date}: { date: Dayjs }) =>
    date >= dayjs().day(0) && date <= dayjs().day(6);
