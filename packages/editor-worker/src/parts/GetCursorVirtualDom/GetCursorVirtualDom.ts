import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getCursorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { columnWidth, rowHeight, selections } = state
  const rowIndex = selections.at(-2) ?? 0
  const columnIndex = selections.at(-1) ?? 0
  const x = columnIndex * columnWidth
  const y = rowIndex * rowHeight
  return [
    {
      childCount: 0,
      className: ClassNames.EditorCursor,
      'data-columnIndex': String(columnIndex),
      'data-rowIndex': String(rowIndex),
      translate: `${x}px ${y}px`,
      type: VirtualDomElements.Div,
    },
  ]
}
