import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'

export const renderItems = (state: EditorState): readonly unknown[] => {
  const { lines, uid } = state
  const dom = GetLinesVirtualDom.getLinesVirtualDom(lines)
  return ['Viewlet.setDom2', uid, dom]
}
