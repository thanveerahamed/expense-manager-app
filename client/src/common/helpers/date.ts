import moment from 'moment';

export const formatDateWithToday = (
  date: string,
  format: string = 'dddd, MMMM Do YYYY',
) => {
  const now = moment();
  const today = now.clone().startOf('day');
  const yesterday = now.clone().subtract(1, 'days').startOf('day');

  const momentDate = moment(date);
  if (momentDate.isSame(today, 'd')) {
    return 'Today';
  }

  if (momentDate.isSame(yesterday, 'd')) {
    return 'Yesterday';
  }

  return momentDate.format(format);
};

export const formatDate = (
  date: string,
  format: string = 'dddd, MMMM Do YYYY',
) => {
  const momentDate = moment(date);
  return momentDate.format(format);
};

export const generateArrayOfYears = () => {
  const max = new Date().getFullYear();
  const min = max - 9;
  const years = [];

  for (let i = max; i >= min; i--) {
    years.push(i.toString());
  }
  return years;
};
