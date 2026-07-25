// based on https://github.com/microsoft/vscode/blob/bd782eb059e133d3a20fdb446b8feb0010a278ad/src/vs/base/common/date.ts (License MIT)
import * as FormatDateStrings from '../FormatDateStrings/FormatDateStrings.ts'
import * as FormatRelativeDate from '../FormatRelativeDate/FormatRelativeDate.ts'
import { minute, hour, day, week, month, year } from '../TimeUnit/TimeUnit.ts'

const ranges = [
  {
    divisor: 1,
    limit: minute,
    one: FormatDateStrings.oneSecondAgo,
    some: FormatDateStrings.someSecondsAgo,
  },
  {
    divisor: minute,
    limit: hour,
    one: FormatDateStrings.oneMinuteAgo,
    some: FormatDateStrings.someMinutesAgo,
  },
  {
    divisor: hour,
    limit: day,
    one: FormatDateStrings.oneHourAgo,
    some: FormatDateStrings.someHoursAgo,
  },
  {
    divisor: day,
    limit: week,
    one: FormatDateStrings.oneDayAgo,
    some: FormatDateStrings.someDaysAgo,
  },
  {
    divisor: week,
    limit: month,
    one: FormatDateStrings.oneWeekAgo,
    some: FormatDateStrings.someWeeksAgo,
  },
  {
    divisor: month,
    limit: year,
    one: FormatDateStrings.oneMonthAgo,
    some: FormatDateStrings.someMonthsAgo,
  },
  {
    divisor: year,
    limit: Infinity,
    one: FormatDateStrings.oneYearAgo,
    some: FormatDateStrings.someYearsAgo,
  },
] as const

export const formatDatePast = (seconds: number): string => {
  return FormatRelativeDate.formatRelativeDate(seconds, ranges)
}
