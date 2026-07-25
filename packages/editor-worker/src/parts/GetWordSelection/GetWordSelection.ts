const isWordCharacter = (character: string): boolean => /[\p{L}\p{N}_-]/u.test(character)

export const getWordSelection = (line: string, rowIndex: number, columnIndex: number): Uint32Array => {
  let startColumnIndex = columnIndex
  while (startColumnIndex > 0 && isWordCharacter(line[startColumnIndex - 1])) {
    startColumnIndex--
  }

  let endColumnIndex = columnIndex
  while (endColumnIndex < line.length && isWordCharacter(line[endColumnIndex])) {
    endColumnIndex++
  }

  return new Uint32Array([rowIndex, startColumnIndex, rowIndex, endColumnIndex])
}
