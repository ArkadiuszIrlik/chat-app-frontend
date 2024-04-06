import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(calendar);
dayjs.extend(localizedFormat);

export default function formatDate(dateObj: Date) {
  return dayjs(dateObj).calendar(null, {
    lastWeek: 'L LT',
    sameElse: 'L LT',
  });
}
