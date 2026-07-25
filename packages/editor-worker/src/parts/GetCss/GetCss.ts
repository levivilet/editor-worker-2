import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetCursorClassName from '../GetCursorClassName/GetCursorClassName.ts'

export const getCss = (state: EditorState): string => {
  const { columnWidth, rowHeight, selections, uid } = state
  const rules: string[] = []
  for (let selectionIndex = 0; selectionIndex < selections.length; selectionIndex += 4) {
    const cursorIndex = selectionIndex / 4
    const rowIndex = selections[selectionIndex + 2]
    const columnIndex = selections[selectionIndex + 3]
    const x = columnIndex * columnWidth
    const y = rowIndex * rowHeight
    const cursorClassName = GetCursorClassName.getCursorClassName(uid, cursorIndex)
    rules.push(`[class~="${cursorClassName}"] {
  translate: ${x}px ${y}px;
}`)
  }
  return rules.join('\n')
}
