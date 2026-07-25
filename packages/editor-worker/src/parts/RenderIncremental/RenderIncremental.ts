import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'

export const renderIncremental = (oldState: EditorState, newState: EditorState): readonly unknown[] => {
  const oldDom = GetLinesVirtualDom.getLinesVirtualDom(oldState.lines)
  const newDom = GetLinesVirtualDom.getLinesVirtualDom(newState.lines)
  const patches = diffTree(oldDom, newDom)
  return ['Viewlet.setPatches', newState.uid, patches]
}
