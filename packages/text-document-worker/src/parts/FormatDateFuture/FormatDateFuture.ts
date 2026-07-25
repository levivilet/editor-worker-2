// based on https://github.com/microsoft/vscode/blob/bd782eb059e133d3a20fdb446b8feb0010a278ad/src/vs/base/common/date.ts (License MIT)
import * as FormatDateStrings from '../FormatDateStrings/FormatDateStrings.ts'
import * as FormatRelativeDate from '../FormatRelativeDate/FormatRelativeDate.ts'
import { day, hour, minute, month, week, year } from '../TimeUnit/TimeUnit.ts'

const ranges = [
  {
    divisor: 1,
    limit: minute,
    one: FormatDateStrings.inOneSecond,
    some: FormatDateStrings.inSomeSeconds,
  },
  {
    divisor: minute,
    limit: hour,
    one: FormatDateStrings.inOneMinute,
    some: FormatDateStrings.inSomeMinutes,
  },
  {
    divisor: hour,
    limit: day,
    one: FormatDateStrings.inOneHour,
    some: FormatDateStrings.inSomeHours,
  },
  {
    divisor: day,
    limit: week,
    one: FormatDateStrings.inOneDay,
    some: FormatDateStrings.inSomeDays,
  },
  {
    divisor: week,
    limit: month,
    one: FormatDateStrings.inOneWeek,
    some: FormatDateStrings.inSomeWeeks,
  },
  {
    divisor: month,
    limit: year,
    one: FormatDateStrings.inOneMonth,
    some: FormatDateStrings.inSomeMonths,
  },
  {
    divisor: year,
    limit: Infinity,
    one: FormatDateStrings.inOneYear,
    some: FormatDateStrings.inSomeYears,
  },
] as const

export const formatDateFuture = (seconds: number): string => {
  return FormatRelativeDate.formatRelativeDate(seconds, ranges)
}
