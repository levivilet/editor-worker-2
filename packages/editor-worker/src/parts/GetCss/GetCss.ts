import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetCursorClassName from '../GetCursorClassName/GetCursorClassName.ts'
import * as GetSelectionVirtualDom from '../GetSelectionVirtualDom/GetSelectionVirtualDom.ts'

const getCursorRule = (state: EditorState, cursorIndex: number, rowIndex: number, columnIndex: number): string => {
  const { columnWidth, minLineY, rowHeight, scrollLeft, scrollTop, uid } = state
  const x = columnIndex * columnWidth - scrollLeft
  const y = (rowIndex - minLineY) * rowHeight - (scrollTop % rowHeight)
  const cursorClassName = GetCursorClassName.getCursorClassName(uid, cursorIndex)
  return `[class~="${cursorClassName}"] {
  translate: ${x}px ${y}px;
}`
}

const getSelectionRules = (
  state: EditorState,
  cursorIndex: number,
  anchorRow: number,
  anchorColumn: number,
  activeRow: number,
  activeColumn: number,
): readonly string[] => {
  if (anchorRow === activeRow && anchorColumn === activeColumn) {
    return []
  }
  const { columnWidth, lines, maxLineY, minLineY, rowHeight, scrollLeft, scrollTop, uid } = state
  const forward = anchorRow < activeRow || (anchorRow === activeRow && anchorColumn <= activeColumn)
  const startRow = forward ? anchorRow : activeRow
  const endRow = forward ? activeRow : anchorRow
  const startColumn = forward ? anchorColumn : activeColumn
  const endColumn = forward ? activeColumn : anchorColumn
  const rules: string[] = []
  for (let selectionRow = Math.max(startRow, minLineY); selectionRow <= Math.min(endRow, maxLineY - 1); selectionRow++) {
    const line = lines[selectionRow - minLineY] ?? ''
    const rowStartColumn = selectionRow === startRow ? startColumn : 0
    const rowEndColumn = selectionRow === endRow ? endColumn : line.length
    const selectionClassName = GetSelectionVirtualDom.getSelectionClassName(uid, cursorIndex, selectionRow)
    const selectionX = rowStartColumn * columnWidth - scrollLeft
    const selectionY = (selectionRow - minLineY) * rowHeight - (scrollTop % rowHeight)
    const selectionWidth = Math.max(columnWidth, (rowEndColumn - rowStartColumn) * columnWidth)
    rules.push(`[class~="${selectionClassName}"] {
  height: ${rowHeight}px;
  translate: ${selectionX}px ${selectionY}px;
  width: ${selectionWidth}px;
}`)
  }
  return rules
}

export const getCss = (state: EditorState): string => {
  const { selections } = state
  const rules: string[] = []
  for (let selectionIndex = 0; selectionIndex < selections.length; selectionIndex += 4) {
    const cursorIndex = selectionIndex / 4
    const anchorRow = selections[selectionIndex]
    const anchorColumn = selections[selectionIndex + 1]
    const activeRow = selections[selectionIndex + 2]
    const activeColumn = selections[selectionIndex + 3]
    rules.push(getCursorRule(state, cursorIndex, activeRow, activeColumn))
    rules.push(...getSelectionRules(state, cursorIndex, anchorRow, anchorColumn, activeRow, activeColumn))
  }
  return rules.join('\n')
}
