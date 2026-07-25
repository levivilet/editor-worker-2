import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetHelloWorldVirtualDom from '../GetHelloWorldVirtualDom/GetHelloWorldVirtualDom.ts'

export const renderItems = (state: EditorState): readonly unknown[] => {
  const dom = GetHelloWorldVirtualDom.getHelloWorldVirtualDom()
  return ['Viewlet.setDom2', state.uid, dom]
}
