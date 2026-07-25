import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getSelectionClassName = (uid: number, selectionIndex: number, rowIndex: number): string => {
  return `EditorSelection-${uid}-${selectionIndex}-${rowIndex}`
}

export const getSelectionVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { maxLineY, minLineY, selections, uid } = state
  const nodes: VirtualDomNode[] = []
  for (let index = 0; index < selections.length; index += 4) {
    const anchorRow = selections[index]
    const anchorColumn = selections[index + 1]
    const activeRow = selections[index + 2]
    const activeColumn = selections[index + 3]
    if (anchorRow === activeRow && anchorColumn === activeColumn) {
      continue
    }
    const forward = anchorRow < activeRow || (anchorRow === activeRow && anchorColumn <= activeColumn)
    const startRow = forward ? anchorRow : activeRow
    const endRow = forward ? activeRow : anchorRow
    for (let rowIndex = Math.max(startRow, minLineY); rowIndex <= Math.min(endRow, maxLineY - 1); rowIndex++) {
      nodes.push({
        childCount: 0,
        className: MergeClassNames.mergeClassNames(ClassNames.EditorSelection, getSelectionClassName(uid, index / 4, rowIndex)),
        'data-rowIndex': String(rowIndex),
        type: VirtualDomElements.Div,
      })
    }
  }
  return nodes
}
