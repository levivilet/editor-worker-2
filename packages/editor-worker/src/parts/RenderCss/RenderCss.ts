import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetCss from '../GetCss/GetCss.ts'

export const renderCss = (state: EditorState): readonly unknown[] => {
  const { uid } = state
  const css = GetCss.getCss(state)
  return ['Viewlet.setCss', uid, css]
}
