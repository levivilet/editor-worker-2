type RelativeDateFormatter = (value: number) => string

type RelativeDateRange = {
  readonly limit: number
  readonly divisor: number
  readonly one: () => string
  readonly some: RelativeDateFormatter
}

const formatRelativeDateRange = (seconds: number, range: RelativeDateRange): string => {
  const value = Math.floor(seconds / range.divisor)
  if (value === 1) {
    return range.one()
  }
  return range.some(value)
}

export const formatRelativeDate = (seconds: number, ranges: readonly RelativeDateRange[]): string => {
  for (const range of ranges) {
    if (seconds < range.limit) {
      return formatRelativeDateRange(seconds, range)
    }
  }
  throw new Error('unreachable')
}
