import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetEditorVirtualDom from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'

export const renderIncremental = (oldState: EditorState, newState: EditorState): readonly unknown[] => {
  const oldDom = GetEditorVirtualDom.getEditorVirtualDom(oldState)
  const newDom = GetEditorVirtualDom.getEditorVirtualDom(newState)
  const patches = diffTree(oldDom, newDom)
  return ['Viewlet.setPatches', newState.uid, patches]
}
