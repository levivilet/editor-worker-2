export const getLongestLineWidth = (lines: readonly string[], columnWidth: number): number => {
  let longestLineLength = 0
  for (const line of lines) {
    longestLineLength = Math.max(longestLineLength, line.length)
  }
  return longestLineLength * columnWidth
}
