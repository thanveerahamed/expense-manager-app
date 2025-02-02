import { Timestamp } from 'firebase/firestore';

const convertTimestampToDate = (timestamp: Timestamp) => timestamp.toDate();

const convertDateToTimestamp = (date: Date) => Timestamp.fromDate(date);

export { convertDateToTimestamp, convertTimestampToDate };
