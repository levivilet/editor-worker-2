import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'

export const getEditorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { diagnostics, tokenizedLines } = state
  return [...GetLinesVirtualDom.getLinesVirtualDom(tokenizedLines), ...GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnostics)]
}
