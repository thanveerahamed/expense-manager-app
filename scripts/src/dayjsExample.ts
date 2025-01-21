import dayjs from "dayjs";
import weekYear from "dayjs/plugin/weekYear"
import weekOfYear from 'dayjs/plugin/weekOfYear'
import duration from 'dayjs/plugin/duration'

dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(duration)

export const runDayJs = () => {
    console.log(dayjs().startOf('week'))
}
