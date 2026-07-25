import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLines from '../GetLines/GetLines.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'

interface OffsetRange {
  readonly end: number
  readonly start: number
}

type Direction = 'left' | 'right'
type Unit = 'character' | 'word'

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum)
}

const getOffset = (lines: readonly string[], rowIndex: number, columnIndex: number): number => {
  const clampedRowIndex = clamp(rowIndex, 0, lines.length - 1)
  let offset = 0
  for (let i = 0; i < clampedRowIndex; i++) {
    offset += lines[i].length + 1
  }
  return offset + clamp(columnIndex, 0, lines[clampedRowIndex].length)
}

const getPosition = (lines: readonly string[], offset: number): readonly [number, number] => {
  let remaining = offset
  for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const lineLength = lines[rowIndex].length
    if (remaining <= lineLength) {
      return [rowIndex, remaining]
    }
    remaining -= lineLength + 1
  }
  const lastRowIndex = lines.length - 1
  return [lastRowIndex, lines[lastRowIndex].length]
}

const isWhitespace = (character: string): boolean => character === ' ' || character === '\t'

const isWordCharacter = (character: string): boolean => /[\p{L}\p{N}_-]/u.test(character)

const getWordLeftColumn = (line: string, columnIndex: number): number => {
  let index = columnIndex
  while (index > 0 && isWhitespace(line[index - 1])) {
    index--
  }
  const characterMatches = index > 0 && isWordCharacter(line[index - 1]) ? isWordCharacter : (character: string): boolean => !isWhitespace(character)
  while (index > 0 && characterMatches(line[index - 1])) {
    index--
  }
  return index
}

const getWordRightColumn = (line: string, columnIndex: number): number => {
  let index = columnIndex
  while (index < line.length && isWhitespace(line[index])) {
    index++
  }
  if (index < line.length && isWordCharacter(line[index])) {
    while (index < line.length && isWordCharacter(line[index])) {
      index++
    }
    return index
  }
  while (index < line.length && !isWhitespace(line[index]) && !isWordCharacter(line[index])) {
    index++
  }
  while (index < line.length && isWordCharacter(line[index])) {
    index++
  }
  return index
}

const getPreviousCharacterColumn = (line: string, columnIndex: number): number => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  let previousColumn = 0
  for (const segment of segmenter.segment(line)) {
    if (segment.index >= columnIndex) {
      break
    }
    previousColumn = segment.index
  }
  return previousColumn
}

const getNextCharacterColumn = (line: string, columnIndex: number): number => {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  for (const segment of segmenter.segment(line)) {
    const segmentEnd = segment.index + segment.segment.length
    if (segmentEnd > columnIndex) {
      return segmentEnd
    }
  }
  return line.length
}

const getCollapsedRange = (lines: readonly string[], rowIndex: number, columnIndex: number, direction: Direction, unit: Unit): OffsetRange => {
  const offset = getOffset(lines, rowIndex, columnIndex)
  const line = lines[rowIndex]
  if (direction === 'left') {
    if (columnIndex === 0) {
      return rowIndex === 0 ? { end: offset, start: offset } : { end: offset, start: offset - 1 }
    }
    const startColumn = unit === 'character' ? getPreviousCharacterColumn(line, columnIndex) : getWordLeftColumn(line, columnIndex)
    return {
      end: offset,
      start: getOffset(lines, rowIndex, startColumn),
    }
  }
  if (columnIndex === line.length) {
    return rowIndex === lines.length - 1 ? { end: offset, start: offset } : { end: offset + 1, start: offset }
  }
  const endColumn = unit === 'character' ? getNextCharacterColumn(line, columnIndex) : getWordRightColumn(line, columnIndex)
  return {
    end: getOffset(lines, rowIndex, endColumn),
    start: offset,
  }
}

const getSelectionRange = (
  lines: readonly string[],
  startRowIndex: number,
  startColumnIndex: number,
  endRowIndex: number,
  endColumnIndex: number,
  direction: Direction,
  unit: Unit,
): OffsetRange => {
  const anchorOffset = getOffset(lines, startRowIndex, startColumnIndex)
  const activeOffset = getOffset(lines, endRowIndex, endColumnIndex)
  if (anchorOffset !== activeOffset) {
    return {
      end: Math.max(anchorOffset, activeOffset),
      start: Math.min(anchorOffset, activeOffset),
    }
  }
  return getCollapsedRange(lines, endRowIndex, endColumnIndex, direction, unit)
}

const mergeRanges = (ranges: readonly OffsetRange[]): readonly OffsetRange[] => {
  const sortedRanges = ranges.filter((range) => range.start !== range.end).toSorted((a, b) => a.start - b.start || a.end - b.end)
  const mergedRanges: OffsetRange[] = []
  for (const range of sortedRanges) {
    const previous = mergedRanges.at(-1)
    if (!previous || range.start > previous.end) {
      mergedRanges.push(range)
      continue
    }
    mergedRanges[mergedRanges.length - 1] = {
      end: Math.max(previous.end, range.end),
      start: previous.start,
    }
  }
  return mergedRanges
}

const applyRanges = (content: string, ranges: readonly OffsetRange[]): string => {
  let newContent = content
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i]
    newContent = newContent.slice(0, range.start) + newContent.slice(range.end)
  }
  return newContent
}

const getOffsetAfterEdits = (offset: number, ranges: readonly OffsetRange[]): number => {
  let deletedBefore = 0
  for (const range of ranges) {
    if (offset <= range.start) {
      break
    }
    if (offset <= range.end) {
      return range.start - deletedBefore
    }
    deletedBefore += range.end - range.start
  }
  return offset - deletedBefore
}

export const deleteText = async (uid: number, direction: Direction, unit: Unit): Promise<void> => {
  const state = EditorStates.get(uid)
  const { languageId, lines: stateLines, selections, tokenizePath } = state
  const lines = stateLines.length === 0 ? [''] : stateLines
  const selectionRanges: OffsetRange[] = []
  for (let i = 0; i < selections.length; i += 4) {
    selectionRanges.push(getSelectionRange(lines, selections[i], selections[i + 1], selections[i + 2], selections[i + 3], direction, unit))
  }
  const ranges = mergeRanges(selectionRanges)
  const content = lines.join('\n')
  const newContent = applyRanges(content, ranges)
  const newLines = GetLines.getLines(newContent)
  const tokenizedLines = await HighlightLines.highlightLines(newContent, languageId, tokenizePath, newLines)
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selectionRanges.length; i++) {
    const newOffset = getOffsetAfterEdits(selectionRanges[i].start, ranges)
    const [rowIndex, columnIndex] = getPosition(newLines, newOffset)
    const selectionIndex = i * 4
    newSelections[selectionIndex] = rowIndex
    newSelections[selectionIndex + 1] = columnIndex
    newSelections[selectionIndex + 2] = rowIndex
    newSelections[selectionIndex + 3] = columnIndex
  }
  EditorStates.set({
    ...state,
    content: newContent,
    lines: newLines,
    selections: newSelections,
    tokenizedLines,
  })
}
