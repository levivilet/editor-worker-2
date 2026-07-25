import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'

export const getEditorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { content, diagnostics, tokenizedLines } = state
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnostics)
  return [
    {
      childCount: diagnosticsDom.length > 0 ? 3 : 2,
      className: ClassNames.Editor,
      type: VirtualDomElements.Div,
    },
    ...GetEditorInputVirtualDom.getEditorInputVirtualDom(content),
    ...GetLinesVirtualDom.getLinesVirtualDom(tokenizedLines),
    ...diagnosticsDom,
  ]
}
