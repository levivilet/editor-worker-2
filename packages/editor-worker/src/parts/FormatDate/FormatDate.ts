// based on https://github.com/microsoft/vscode/blob/bd782eb059e133d3a20fdb446b8feb0010a278ad/src/vs/base/common/date.ts (License MIT)
import * as FormatDateFuture from '../FormatDateFuture/FormatDateFuture.ts'
import * as FormatDatePast from '../FormatDatePast/FormatDatePast.ts'

export const formatDate = (date: number, now: number): string => {
  const difference = now - date
  const seconds = Math.round(difference / 1000)
  if (seconds >= 0) {
    return FormatDatePast.formatDatePast(seconds)
  }
  return FormatDateFuture.formatDateFuture(-seconds)
}
