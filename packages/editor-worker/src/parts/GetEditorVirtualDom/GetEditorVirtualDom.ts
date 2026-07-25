import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetCursorVirtualDom from '../GetCursorVirtualDom/GetCursorVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetLineNumbersVirtualDom from '../GetLineNumbersVirtualDom/GetLineNumbersVirtualDom.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'

const editorNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.Editor,
  type: VirtualDomElements.Div,
}

export const getEditorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { diagnostics, lineNumbers, lines, scrollBarWidth, tokenizedLines } = state
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnostics)
  const lineNumbersDom = lineNumbers ? GetLineNumbersVirtualDom.getLineNumbersVirtualDom(lines) : []
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarWidth)
  return [
    editorNode,
    ...GetEditorInputVirtualDom.getEditorInputVirtualDom(lines.join('\n')),
    {
      childCount: 2 + (lineNumbers ? 1 : 0) + (diagnosticsDom.length > 0 ? 1 : 0) + (scrollBarDom.length > 0 ? 1 : 0),
      className: ClassNames.EditorContent,
      onClick: DomEventListenerFunctions.HandleClick,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...lineNumbersDom,
    ...GetLinesVirtualDom.getLinesVirtualDom(tokenizedLines),
    ...diagnosticsDom,
    ...scrollBarDom,
    ...GetCursorVirtualDom.getCursorVirtualDom(state),
  ]
}
