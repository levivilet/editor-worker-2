import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetCursorClassName from '../GetCursorClassName/GetCursorClassName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getCursorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { selections, uid } = state
  const cursors: VirtualDomNode[] = []
  for (let selectionIndex = 0; selectionIndex < selections.length; selectionIndex += 4) {
    const cursorIndex = selectionIndex / 4
    const rowIndex = selections[selectionIndex + 2]
    const columnIndex = selections[selectionIndex + 3]
    const cursorClassName = GetCursorClassName.getCursorClassName(uid, cursorIndex)
    cursors.push({
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.EditorCursor, cursorClassName),
      'data-columnIndex': String(columnIndex),
      'data-rowIndex': String(rowIndex),
      type: VirtualDomElements.Div,
    })
  }
  return cursors
}
