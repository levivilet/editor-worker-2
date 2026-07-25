import type { EditorState } from '../EditorState/EditorState.ts'

interface EditorPosition {
  readonly columnIndex: number
  readonly rowIndex: number
}

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.min(Math.max(value, minimum), maximum)
}

export const getClickPosition = (state: EditorState, eventX: number, eventY: number): EditorPosition => {
  const { columnWidth, lines, rowHeight, x, y } = state
  if (lines.length === 0) {
    return {
      columnIndex: 0,
      rowIndex: 0,
    }
  }
  const rowIndex = clamp(Math.floor((eventY - y) / rowHeight), 0, lines.length - 1)
  const line = lines[rowIndex]
  const columnIndex = clamp(Math.round((eventX - x) / columnWidth), 0, line.length)
  return {
    columnIndex,
    rowIndex,
  }
}
