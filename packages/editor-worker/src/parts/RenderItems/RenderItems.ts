import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetEditorVirtualDom from '../GetEditorVirtualDom/GetEditorVirtualDom.ts'

export const renderItems = (state: EditorState): readonly unknown[] => {
  const { uid } = state
  const dom = GetEditorVirtualDom.getEditorVirtualDom(state)
  return ['Viewlet.setDom2', uid, dom]
}
