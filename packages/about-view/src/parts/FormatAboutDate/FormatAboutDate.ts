import * as FormatDate from '../FormatDate/FormatDate.ts'

export const formatAboutDate = (isoDate: string, now: number): string => {
  if (!isoDate) {
    return 'unknown'
  }
  const date = new Date(isoDate).getTime()
  if (Number.isNaN(date)) {
    return `Invalid Date: ${isoDate}`
  }
  const ago = FormatDate.formatDate(date, now)
  return `${isoDate} (${ago})`
}
