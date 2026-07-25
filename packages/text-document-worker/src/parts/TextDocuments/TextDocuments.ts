/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import * as GetLines from '../GetLines/GetLines.ts'

export interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

interface TextRange {
  readonly end: Position
  readonly start: Position
}

export interface TextEdit {
  readonly range: TextRange
  readonly text: string
}

export interface DocumentSnapshot {
  readonly canRedo: boolean
  readonly canUndo: boolean
  readonly lineCount: number
  readonly longestLineLength: number
  readonly modified: boolean
  readonly selections: readonly number[]
  readonly version: number
}

interface AppliedEdit {
  readonly forward: TextEdit
  readonly inverse: TextEdit
}

interface HistoryTransaction {
  readonly afterSelections: readonly number[]
  readonly afterStateId: number
  readonly beforeSelections: readonly number[]
  readonly beforeStateId: number
  readonly edits: readonly AppliedEdit[]
}

interface HistoryGroup {
  readonly origin: string
  readonly timestamp: number
  readonly transactions: readonly HistoryTransaction[]
}

interface TextDocument {
  desiredColumns: number[]
  lineLengthCounts: Map<number, number>
  lines: string[]
  longestLineLength: number
  preferredEol: '\n' | '\r\n'
  redoStack: HistoryGroup[]
  savedStateId: number
  selections: number[]
  stateId: number
  undoStack: HistoryGroup[]
  version: number
}

interface Replacement {
  readonly range: TextRange
  readonly selectionIndex: number
  readonly text: string
}

type Direction = 'down' | 'end' | 'left' | 'right' | 'start' | 'up' | 'wordLeft' | 'wordRight'
type DeleteDirection = 'left' | 'right'
type DeleteUnit = 'all' | 'character' | 'word'

const documents = new Map<number, TextDocument>()
const globalState = {
  nextStateId: 1,
}

const getNextStateId = (): number => {
  return globalState.nextStateId++
}

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum)
}

const comparePositions = (a: Position, b: Position): number => {
  return a.rowIndex - b.rowIndex || a.columnIndex - b.columnIndex
}

const clonePosition = (position: Position): Position => {
  return {
    columnIndex: position.columnIndex,
    rowIndex: position.rowIndex,
  }
}

const cloneRange = (range: TextRange): TextRange => {
  return {
    end: clonePosition(range.end),
    start: clonePosition(range.start),
  }
}

const get = (id: number): TextDocument => {
  const document = documents.get(id)
  if (!document) {
    throw new Error(`Text document not found: ${id}`)
  }
  return document
}

const getPreferredEol = (content: string): '\n' | '\r\n' => {
  const crlfIndex = content.indexOf('\r\n')
  const lfIndex = content.indexOf('\n')
  return crlfIndex !== -1 && (lfIndex === -1 || crlfIndex === lfIndex - 1) ? '\r\n' : '\n'
}

const normalizeInsertedText = (text: string): string => {
  return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n')
}

const computeLongestLineLength = (lines: readonly string[]): number => {
  let longestLineLength = 0
  for (const line of lines) {
    longestLineLength = Math.max(longestLineLength, line.length)
  }
  return longestLineLength
}

const getLineLengthCounts = (lines: readonly string[]): Map<number, number> => {
  const counts = new Map<number, number>()
  for (const line of lines) {
    counts.set(line.length, (counts.get(line.length) ?? 0) + 1)
  }
  return counts
}

const updateLineLengthCount = (counts: Map<number, number>, lineLength: number, delta: number): void => {
  const count = (counts.get(lineLength) ?? 0) + delta
  if (count === 0) {
    counts.delete(lineLength)
  } else {
    counts.set(lineLength, count)
  }
}

const updateLineLengths = (document: TextDocument, removedLines: readonly string[], replacementLines: readonly string[]): void => {
  for (const line of removedLines) {
    updateLineLengthCount(document.lineLengthCounts, line.length, -1)
  }
  for (const line of replacementLines) {
    updateLineLengthCount(document.lineLengthCounts, line.length, 1)
    document.longestLineLength = Math.max(document.longestLineLength, line.length)
  }
  if (!document.lineLengthCounts.has(document.longestLineLength)) {
    document.longestLineLength = 0
    for (const lineLength of document.lineLengthCounts.keys()) {
      document.longestLineLength = Math.max(document.longestLineLength, lineLength)
    }
  }
}

const snapshot = (document: TextDocument): DocumentSnapshot => {
  return {
    canRedo: document.redoStack.length > 0,
    canUndo: document.undoStack.length > 0,
    lineCount: document.lines.length,
    longestLineLength: document.longestLineLength,
    modified: document.stateId !== document.savedStateId,
    selections: [...document.selections],
    version: document.version,
  }
}

const clampPosition = (document: TextDocument, position: Position): Position => {
  const rowIndex = clamp(position.rowIndex, 0, document.lines.length - 1)
  return {
    columnIndex: clamp(position.columnIndex, 0, document.lines[rowIndex].length),
    rowIndex,
  }
}

const normalizeRange = (document: TextDocument, range: TextRange): TextRange => {
  const start = clampPosition(document, range.start)
  const end = clampPosition(document, range.end)
  if (comparePositions(start, end) <= 0) {
    return { end, start }
  }
  return {
    end: start,
    start: end,
  }
}

const getTextInRange = (document: TextDocument, range: TextRange): string => {
  const { end, start } = normalizeRange(document, range)
  if (start.rowIndex === end.rowIndex) {
    return document.lines[start.rowIndex].slice(start.columnIndex, end.columnIndex)
  }
  return [
    document.lines[start.rowIndex].slice(start.columnIndex),
    ...document.lines.slice(start.rowIndex + 1, end.rowIndex),
    document.lines[end.rowIndex].slice(0, end.columnIndex),
  ].join('\n')
}

const getInsertedEnd = (start: Position, insertedLines: readonly string[]): Position => {
  if (insertedLines.length === 1) {
    return {
      columnIndex: start.columnIndex + insertedLines[0].length,
      rowIndex: start.rowIndex,
    }
  }
  return {
    columnIndex: insertedLines.at(-1)?.length ?? 0,
    rowIndex: start.rowIndex + insertedLines.length - 1,
  }
}

const applySingleEdit = (document: TextDocument, edit: TextEdit): AppliedEdit => {
  const range = normalizeRange(document, edit.range)
  const text = normalizeInsertedText(edit.text)
  const deletedText = getTextInRange(document, range)
  const insertedLines = GetLines.getLines(text)
  const before = document.lines[range.start.rowIndex].slice(0, range.start.columnIndex)
  const after = document.lines[range.end.rowIndex].slice(range.end.columnIndex)
  const replacement =
    insertedLines.length === 1
      ? [before + insertedLines[0] + after]
      : [before + insertedLines[0], ...insertedLines.slice(1, -1), (insertedLines.at(-1) ?? '') + after]
  const removedLines = document.lines.slice(range.start.rowIndex, range.end.rowIndex + 1)
  document.lines.splice(range.start.rowIndex, range.end.rowIndex - range.start.rowIndex + 1, ...replacement)
  updateLineLengths(document, removedLines, replacement)
  const insertedEnd = getInsertedEnd(range.start, insertedLines)
  return {
    forward: {
      range: cloneRange(range),
      text,
    },
    inverse: {
      range: {
        end: insertedEnd,
        start: clonePosition(range.start),
      },
      text: deletedText,
    },
  }
}

const positionToOffset = (lines: readonly string[], position: Position): number => {
  const rowIndex = clamp(position.rowIndex, 0, lines.length - 1)
  let offset = 0
  for (let index = 0; index < rowIndex; index++) {
    offset += lines[index].length + 1
  }
  return offset + clamp(position.columnIndex, 0, lines[rowIndex].length)
}

const offsetToPosition = (lines: readonly string[], offset: number): Position => {
  let remaining = Math.max(0, offset)
  for (let rowIndex = 0; rowIndex < lines.length; rowIndex++) {
    const lineLength = lines[rowIndex].length
    if (remaining <= lineLength) {
      return {
        columnIndex: remaining,
        rowIndex,
      }
    }
    remaining -= lineLength + 1
  }
  const rowIndex = lines.length - 1
  return {
    columnIndex: lines[rowIndex].length,
    rowIndex,
  }
}

const selectionsEqual = (a: readonly number[], b: readonly number[]): boolean => {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

const isMergeableOrigin = (origin: string): boolean => {
  return ['deleteCharacterLeft', 'deleteCharacterRight', 'type'].includes(origin)
}

const pushHistory = (document: TextDocument, transaction: HistoryTransaction, origin: string): void => {
  const timestamp = Date.now()
  const previous = document.undoStack.at(-1)
  if (
    previous &&
    previous.origin === origin &&
    isMergeableOrigin(origin) &&
    timestamp - previous.timestamp <= 1000 &&
    selectionsEqual(previous.transactions.at(-1)?.afterSelections ?? [], transaction.beforeSelections)
  ) {
    document.undoStack[document.undoStack.length - 1] = {
      origin,
      timestamp,
      transactions: [...previous.transactions, transaction],
    }
  } else {
    document.undoStack.push({
      origin,
      timestamp,
      transactions: [transaction],
    })
  }
  document.redoStack = []
}

const applyReplacements = (document: TextDocument, replacements: readonly Replacement[], origin: string): DocumentSnapshot => {
  const beforeSelections = [...document.selections]
  const beforeStateId = document.stateId
  const useOffsets = replacements.length > 1
  const normalized = replacements
    .map((replacement) => {
      const range = normalizeRange(document, replacement.range)
      return {
        ...replacement,
        endOffset: useOffsets ? positionToOffset(document.lines, range.end) : 0,
        range,
        startOffset: useOffsets ? positionToOffset(document.lines, range.start) : 0,
        text: normalizeInsertedText(replacement.text),
      }
    })
    .toSorted((a, b) => b.startOffset - a.startOffset || b.endOffset - a.endOffset)
  const applied: AppliedEdit[] = Array.from(normalized, (replacement) =>
    applySingleEdit(document, {
      range: replacement.range,
      text: replacement.text,
    }),
  )
  const ascending = normalized.toSorted((a, b) => a.startOffset - b.startOffset || a.endOffset - b.endOffset)
  const newSelections = [...beforeSelections]
  newSelections.fill(0)
  if (normalized.length === 1) {
    const replacement = normalized[0]
    const position = applied[0].inverse.range.end
    const index = replacement.selectionIndex * 4
    newSelections[index] = position.rowIndex
    newSelections[index + 1] = position.columnIndex
    newSelections[index + 2] = position.rowIndex
    newSelections[index + 3] = position.columnIndex
  } else {
    let cumulativeDelta = 0
    for (const replacement of ascending) {
      const finalOffset = replacement.startOffset + cumulativeDelta + replacement.text.length
      const position = offsetToPosition(document.lines, finalOffset)
      const index = replacement.selectionIndex * 4
      newSelections[index] = position.rowIndex
      newSelections[index + 1] = position.columnIndex
      newSelections[index + 2] = position.rowIndex
      newSelections[index + 3] = position.columnIndex
      cumulativeDelta += replacement.text.length - (replacement.endOffset - replacement.startOffset)
    }
  }
  document.selections = newSelections
  document.desiredColumns = newSelections.filter((_value, index) => index % 4 === 3)
  document.version++
  document.stateId = getNextStateId()
  pushHistory(
    document,
    {
      afterSelections: [...document.selections],
      afterStateId: document.stateId,
      beforeSelections,
      beforeStateId,
      edits: applied,
    },
    origin,
  )
  return snapshot(document)
}

const selectionRanges = (document: TextDocument): readonly TextRange[] => {
  const ranges: TextRange[] = []
  for (let index = 0; index < document.selections.length; index += 4) {
    ranges.push({
      end: {
        columnIndex: document.selections[index + 3],
        rowIndex: document.selections[index + 2],
      },
      start: {
        columnIndex: document.selections[index + 1],
        rowIndex: document.selections[index],
      },
    })
  }
  return ranges
}

const getPreviousGraphemeColumn = (line: string, columnIndex: number): number => {
  let previous = 0
  const segments = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(line)
  for (const segment of segments) {
    if (segment.index >= columnIndex) {
      break
    }
    previous = segment.index
  }
  return previous
}

const getNextGraphemeColumn = (line: string, columnIndex: number): number => {
  const segments = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(line)
  for (const segment of segments) {
    const end = segment.index + segment.segment.length
    if (end > columnIndex) {
      return end
    }
  }
  return line.length
}

const isWhitespace = (character: string): boolean => /\s/u.test(character)
const isWordCharacter = (character: string): boolean => /[\p{L}\p{N}_]/u.test(character)

const getWordLeftColumn = (line: string, columnIndex: number): number => {
  let index = columnIndex
  while (index > 0 && isWhitespace(line[index - 1])) {
    index--
  }
  const predicate = index > 0 && isWordCharacter(line[index - 1]) ? isWordCharacter : (character: string): boolean => !isWhitespace(character)
  while (index > 0 && predicate(line[index - 1])) {
    index--
  }
  return index
}

const getWordRightColumn = (line: string, columnIndex: number): number => {
  let index = columnIndex
  while (index < line.length && isWhitespace(line[index])) {
    index++
  }
  const predicate = index < line.length && isWordCharacter(line[index]) ? isWordCharacter : (character: string): boolean => !isWhitespace(character)
  while (index < line.length && predicate(line[index])) {
    index++
  }
  return index
}

const getDeleteColumn = (line: string, columnIndex: number, direction: DeleteDirection, unit: DeleteUnit): number => {
  if (unit === 'all') {
    return direction === 'left' ? 0 : line.length
  }
  if (unit === 'character') {
    return direction === 'left' ? getPreviousGraphemeColumn(line, columnIndex) : getNextGraphemeColumn(line, columnIndex)
  }
  return direction === 'left' ? getWordLeftColumn(line, columnIndex) : getWordRightColumn(line, columnIndex)
}

const getDeleteRange = (document: TextDocument, range: TextRange, direction: DeleteDirection, unit: DeleteUnit): TextRange => {
  const normalized = normalizeRange(document, range)
  if (comparePositions(normalized.start, normalized.end) !== 0) {
    return normalized
  }
  const position = normalized.start
  const line = document.lines[position.rowIndex]
  if (direction === 'left') {
    if (position.columnIndex === 0) {
      if (position.rowIndex === 0) {
        return normalized
      }
      return {
        end: position,
        start: {
          columnIndex: document.lines[position.rowIndex - 1].length,
          rowIndex: position.rowIndex - 1,
        },
      }
    }
    const columnIndex = getDeleteColumn(line, position.columnIndex, direction, unit)
    return {
      end: position,
      start: {
        columnIndex,
        rowIndex: position.rowIndex,
      },
    }
  }
  if (position.columnIndex === line.length) {
    if (position.rowIndex === document.lines.length - 1) {
      return normalized
    }
    return {
      end: {
        columnIndex: 0,
        rowIndex: position.rowIndex + 1,
      },
      start: position,
    }
  }
  const columnIndex = getDeleteColumn(line, position.columnIndex, direction, unit)
  return {
    end: {
      columnIndex,
      rowIndex: position.rowIndex,
    },
    start: position,
  }
}

const replaceSelections = (id: number, text: string, origin: string): DocumentSnapshot => {
  const document = get(id)
  return applyReplacements(
    document,
    selectionRanges(document).map((range, selectionIndex) => ({
      range,
      selectionIndex,
      text,
    })),
    origin,
  )
}

const deleteSelections = (id: number, direction: DeleteDirection, unit: DeleteUnit, origin: string): DocumentSnapshot => {
  const document = get(id)
  return applyReplacements(
    document,
    selectionRanges(document).map((range, selectionIndex) => ({
      range: getDeleteRange(document, range, direction, unit),
      selectionIndex,
      text: '',
    })),
    origin,
  )
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const getMovedPosition = (document: TextDocument, position: Position, direction: Direction, desiredColumn: number): Position => {
  const line = document.lines[position.rowIndex]
  switch (direction) {
    case 'down': {
      const rowIndex = Math.min(document.lines.length - 1, position.rowIndex + 1)
      return { columnIndex: Math.min(desiredColumn, document.lines[rowIndex].length), rowIndex }
    }
    case 'end':
      return { columnIndex: line.length, rowIndex: position.rowIndex }
    case 'left':
      if (position.columnIndex > 0) {
        return { columnIndex: getPreviousGraphemeColumn(line, position.columnIndex), rowIndex: position.rowIndex }
      }
      return position.rowIndex === 0 ? position : { columnIndex: document.lines[position.rowIndex - 1].length, rowIndex: position.rowIndex - 1 }
    case 'right':
      if (position.columnIndex < line.length) {
        return { columnIndex: getNextGraphemeColumn(line, position.columnIndex), rowIndex: position.rowIndex }
      }
      return position.rowIndex === document.lines.length - 1 ? position : { columnIndex: 0, rowIndex: position.rowIndex + 1 }
    case 'start':
      return { columnIndex: 0, rowIndex: position.rowIndex }
    case 'up': {
      const rowIndex = Math.max(0, position.rowIndex - 1)
      return { columnIndex: Math.min(desiredColumn, document.lines[rowIndex].length), rowIndex }
    }
    case 'wordLeft':
      if (position.columnIndex > 0) {
        return { columnIndex: getWordLeftColumn(line, position.columnIndex), rowIndex: position.rowIndex }
      }
      return position.rowIndex === 0 ? position : { columnIndex: document.lines[position.rowIndex - 1].length, rowIndex: position.rowIndex - 1 }
    case 'wordRight':
      if (position.columnIndex < line.length) {
        return { columnIndex: getWordRightColumn(line, position.columnIndex), rowIndex: position.rowIndex }
      }
      return position.rowIndex === document.lines.length - 1 ? position : { columnIndex: 0, rowIndex: position.rowIndex + 1 }
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const moveSelections = (id: number, direction: Direction, select: boolean): DocumentSnapshot => {
  const document = get(id)
  const selections = [...document.selections]
  const newDesiredColumns: number[] = []
  for (let index = 0; index < selections.length; index += 4) {
    const anchor = clampPosition(document, { columnIndex: selections[index + 1], rowIndex: selections[index] })
    const active = clampPosition(document, { columnIndex: selections[index + 3], rowIndex: selections[index + 2] })
    const desiredColumn = direction === 'up' || direction === 'down' ? (document.desiredColumns[index / 4] ?? active.columnIndex) : active.columnIndex
    let moved: Position
    if (!select && comparePositions(anchor, active) !== 0 && (direction === 'left' || direction === 'wordLeft')) {
      moved = comparePositions(anchor, active) < 0 ? anchor : active
    } else if (!select && comparePositions(anchor, active) !== 0 && (direction === 'right' || direction === 'wordRight')) {
      moved = comparePositions(anchor, active) > 0 ? anchor : active
    } else {
      moved = getMovedPosition(document, active, direction, desiredColumn)
    }
    selections[index] = (select ? anchor : moved).rowIndex
    selections[index + 1] = (select ? anchor : moved).columnIndex
    selections[index + 2] = moved.rowIndex
    selections[index + 3] = moved.columnIndex
    newDesiredColumns.push(direction === 'up' || direction === 'down' ? desiredColumn : moved.columnIndex)
  }
  document.selections = selections
  document.desiredColumns = newDesiredColumns
  return snapshot(document)
}

export const setContent = (id: number, content: string): DocumentSnapshot => {
  const lines = GetLines.getLines(content)
  const stateId = getNextStateId()
  const document: TextDocument = {
    desiredColumns: [0],
    lineLengthCounts: getLineLengthCounts(lines),
    lines: [...lines],
    longestLineLength: computeLongestLineLength(lines),
    preferredEol: getPreferredEol(content),
    redoStack: [],
    savedStateId: stateId,
    selections: [0, 0, 0, 0],
    stateId,
    undoStack: [],
    version: 1,
  }
  documents.set(id, document)
  return snapshot(document)
}

export const getSnapshot = (id: number): DocumentSnapshot => {
  return snapshot(get(id))
}

export const getLines = (id: number, startLineIndex: number, endLineIndex: number): readonly string[] => {
  const { lines } = get(id)
  return lines.slice(clamp(startLineIndex, 0, lines.length), clamp(endLineIndex, 0, lines.length))
}

export const getText = (id: number): string => {
  const document = get(id)
  return document.lines.join(document.preferredEol)
}

export const getSelectedText = (id: number): string => {
  const document = get(id)
  return selectionRanges(document)
    .map((range) => getTextInRange(document, range))
    .join('\n')
}

export const offsetAt = (id: number, rowIndex: number, columnIndex: number): number => {
  const document = get(id)
  return positionToOffset(document.lines, clampPosition(document, { columnIndex, rowIndex }))
}

export const positionAt = (id: number, offset: number): Position => {
  return offsetToPosition(get(id).lines, offset)
}

export const setSelections = (id: number, selections: readonly number[]): DocumentSnapshot => {
  if (selections.length === 0 || selections.length % 4 !== 0) {
    throw new Error('Text document selections must contain one or more groups of four values')
  }
  const document = get(id)
  const clamped: number[] = []
  for (let index = 0; index < selections.length; index += 4) {
    const anchor = clampPosition(document, { columnIndex: selections[index + 1], rowIndex: selections[index] })
    const active = clampPosition(document, { columnIndex: selections[index + 3], rowIndex: selections[index + 2] })
    clamped.push(anchor.rowIndex, anchor.columnIndex, active.rowIndex, active.columnIndex)
  }
  document.selections = clamped
  document.desiredColumns = clamped.filter((_value, index) => index % 4 === 3)
  return snapshot(document)
}

export const type = (id: number, text: string): DocumentSnapshot => replaceSelections(id, text, 'type')
export const pasteText = (id: number, text: string): DocumentSnapshot => replaceSelections(id, text, 'paste')
export const deleteCharacterLeft = (id: number): DocumentSnapshot => deleteSelections(id, 'left', 'character', 'deleteCharacterLeft')
export const deleteCharacterRight = (id: number): DocumentSnapshot => deleteSelections(id, 'right', 'character', 'deleteCharacterRight')
export const deleteWordLeft = (id: number): DocumentSnapshot => deleteSelections(id, 'left', 'word', 'deleteWordLeft')
export const deleteWordRight = (id: number): DocumentSnapshot => deleteSelections(id, 'right', 'word', 'deleteWordRight')
export const deleteAllLeft = (id: number): DocumentSnapshot => deleteSelections(id, 'left', 'all', 'deleteAllLeft')
export const deleteAllRight = (id: number): DocumentSnapshot => deleteSelections(id, 'right', 'all', 'deleteAllRight')

export const deleteLine = (id: number): DocumentSnapshot => {
  const document = get(id)
  const ranges = selectionRanges(document).map((range, selectionIndex) => {
    const normalized = normalizeRange(document, range)
    const startRowIndex = normalized.start.rowIndex
    const endRowIndex = normalized.end.rowIndex
    const isLastLine = endRowIndex === document.lines.length - 1
    return {
      range: {
        end: isLastLine ? { columnIndex: document.lines[endRowIndex].length, rowIndex: endRowIndex } : { columnIndex: 0, rowIndex: endRowIndex + 1 },
        start:
          isLastLine && startRowIndex > 0
            ? { columnIndex: document.lines[startRowIndex - 1].length, rowIndex: startRowIndex - 1 }
            : { columnIndex: 0, rowIndex: startRowIndex },
      },
      selectionIndex,
      text: '',
    }
  })
  return applyReplacements(document, ranges, 'deleteLine')
}

const updateIndentation = (id: number, tabSize: number, unindent: boolean): DocumentSnapshot => {
  const document = get(id)
  const lineIndexes = new Set<number>()
  for (const range of selectionRanges(document)) {
    const normalized = normalizeRange(document, range)
    for (let { rowIndex } = normalized.start; rowIndex <= normalized.end.rowIndex; rowIndex++) {
      lineIndexes.add(rowIndex)
    }
  }
  const replacements = Array.from(lineIndexes, (rowIndex, selectionIndex) => {
    const line = document.lines.at(rowIndex) ?? ''
    const removeCount = unindent ? Math.min(line.match(/^ +/u)?.[0].length ?? 0, tabSize) : 0
    return {
      range: {
        end: { columnIndex: removeCount, rowIndex },
        start: { columnIndex: 0, rowIndex },
      },
      selectionIndex: Math.min(selectionIndex, document.selections.length / 4 - 1),
      text: unindent ? '' : ' '.repeat(tabSize),
    }
  })
  return applyReplacements(document, replacements, unindent ? 'unindent' : 'indent')
}

export const indent = (id: number, tabSize = 2): DocumentSnapshot => updateIndentation(id, tabSize, false)
export const unindent = (id: number, tabSize = 2): DocumentSnapshot => updateIndentation(id, tabSize, true)

export const insertLineBreak = (id: number): DocumentSnapshot => {
  const document = get(id)
  const activeRowIndex = document.selections[2]
  const indentation = document.lines[activeRowIndex]?.match(/^\s*/u)?.[0] ?? ''
  return replaceSelections(id, `\n${indentation}`, 'insertLineBreak')
}

export const insertTab = (id: number, tabSize = 2): DocumentSnapshot => {
  const document = get(id)
  const columnIndex = document.selections[3]
  return replaceSelections(id, ' '.repeat(tabSize - (columnIndex % tabSize)), 'insertTab')
}

export const cursorLeft = (id: number): DocumentSnapshot => moveSelections(id, 'left', false)
export const cursorRight = (id: number): DocumentSnapshot => moveSelections(id, 'right', false)
export const cursorWordLeft = (id: number): DocumentSnapshot => moveSelections(id, 'wordLeft', false)
export const cursorWordRight = (id: number): DocumentSnapshot => moveSelections(id, 'wordRight', false)
export const cursorUp = (id: number): DocumentSnapshot => moveSelections(id, 'up', false)
export const cursorDown = (id: number): DocumentSnapshot => moveSelections(id, 'down', false)
export const cursorHome = (id: number): DocumentSnapshot => moveSelections(id, 'start', false)
export const cursorEnd = (id: number): DocumentSnapshot => moveSelections(id, 'end', false)
export const selectLeft = (id: number): DocumentSnapshot => moveSelections(id, 'left', true)
export const selectRight = (id: number): DocumentSnapshot => moveSelections(id, 'right', true)
export const selectWordLeft = (id: number): DocumentSnapshot => moveSelections(id, 'wordLeft', true)
export const selectWordRight = (id: number): DocumentSnapshot => moveSelections(id, 'wordRight', true)
export const selectUp = (id: number): DocumentSnapshot => moveSelections(id, 'up', true)
export const selectDown = (id: number): DocumentSnapshot => moveSelections(id, 'down', true)
export const selectHome = (id: number): DocumentSnapshot => moveSelections(id, 'start', true)
export const selectEnd = (id: number): DocumentSnapshot => moveSelections(id, 'end', true)

export const cursorDocumentStart = (id: number): DocumentSnapshot => {
  return setSelections(id, [0, 0, 0, 0])
}

export const cursorDocumentEnd = (id: number): DocumentSnapshot => {
  const document = get(id)
  const rowIndex = document.lines.length - 1
  const columnIndex = document.lines[rowIndex].length
  return setSelections(id, [rowIndex, columnIndex, rowIndex, columnIndex])
}

export const selectDocumentStart = (id: number): DocumentSnapshot => {
  const document = get(id)
  const selections = [...document.selections]
  for (let index = 0; index < selections.length; index += 4) {
    selections[index + 2] = 0
    selections[index + 3] = 0
  }
  return setSelections(id, selections)
}

export const selectDocumentEnd = (id: number): DocumentSnapshot => {
  const document = get(id)
  const rowIndex = document.lines.length - 1
  const columnIndex = document.lines[rowIndex].length
  const selections = [...document.selections]
  for (let index = 0; index < selections.length; index += 4) {
    selections[index + 2] = rowIndex
    selections[index + 3] = columnIndex
  }
  return setSelections(id, selections)
}

export const selectAll = (id: number): DocumentSnapshot => {
  const document = get(id)
  const rowIndex = document.lines.length - 1
  return setSelections(id, [0, 0, rowIndex, document.lines[rowIndex].length])
}

export const applyEdits = (id: number, edits: readonly TextEdit[]): DocumentSnapshot => {
  const document = get(id)
  return applyReplacements(
    document,
    edits.map((edit, selectionIndex) => ({
      range: edit.range,
      selectionIndex,
      text: edit.text,
    })),
    'applyEdits',
  )
}

export const undo = (id: number): DocumentSnapshot => {
  const document = get(id)
  const group = document.undoStack.pop()
  if (!group) {
    return snapshot(document)
  }
  for (let transactionIndex = group.transactions.length - 1; transactionIndex >= 0; transactionIndex--) {
    const transaction = group.transactions[transactionIndex]
    for (let editIndex = transaction.edits.length - 1; editIndex >= 0; editIndex--) {
      applySingleEdit(document, transaction.edits[editIndex].inverse)
    }
  }
  const first = group.transactions[0]
  document.selections = [...first.beforeSelections]
  document.desiredColumns = document.selections.filter((_value, index) => index % 4 === 3)
  document.stateId = first.beforeStateId
  document.longestLineLength = computeLongestLineLength(document.lines)
  document.version++
  document.redoStack.push(group)
  return snapshot(document)
}

export const redo = (id: number): DocumentSnapshot => {
  const document = get(id)
  const group = document.redoStack.pop()
  if (!group) {
    return snapshot(document)
  }
  for (const transaction of group.transactions) {
    for (const edit of transaction.edits) {
      applySingleEdit(document, edit.forward)
    }
  }
  const last = group.transactions.at(-1)!
  document.selections = [...last.afterSelections]
  document.desiredColumns = document.selections.filter((_value, index) => index % 4 === 3)
  document.stateId = last.afterStateId
  document.longestLineLength = computeLongestLineLength(document.lines)
  document.version++
  document.undoStack.push(group)
  return snapshot(document)
}

export const markSaved = (id: number, version: number): DocumentSnapshot => {
  const document = get(id)
  if (document.version !== version) {
    throw new Error(`Cannot mark stale text document version as saved: expected ${document.version}, received ${version}`)
  }
  document.savedStateId = document.stateId
  return snapshot(document)
}

export const dispose = (id: number): void => {
  documents.delete(id)
}
