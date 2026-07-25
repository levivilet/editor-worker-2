import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'

export const getEditorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { content, diagnostics, scrollBarWidth, tokenizedLines } = state
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnostics)
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarWidth)
  return [
    {
      childCount: 2 + (diagnosticsDom.length > 0 ? 1 : 0) + (scrollBarDom.length > 0 ? 1 : 0),
      className: ClassNames.Editor,
      type: VirtualDomElements.Div,
    },
    ...GetEditorInputVirtualDom.getEditorInputVirtualDom(content),
    ...GetLinesVirtualDom.getLinesVirtualDom(tokenizedLines),
    ...diagnosticsDom,
    ...scrollBarDom,
  ]
}
