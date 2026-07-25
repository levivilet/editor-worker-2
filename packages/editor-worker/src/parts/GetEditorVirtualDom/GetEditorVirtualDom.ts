import { AriaRoles, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetCursorVirtualDom from '../GetCursorVirtualDom/GetCursorVirtualDom.ts'
import * as GetDiagnosticsVirtualDom from '../GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as GetEditorInputVirtualDom from '../GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'
import * as GetFindWidgetVirtualDom from '../GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'
import * as GetLineNumbersVirtualDom from '../GetLineNumbersVirtualDom/GetLineNumbersVirtualDom.ts'
import * as GetLinesVirtualDom from '../GetLinesVirtualDom/GetLinesVirtualDom.ts'
import * as GetScrollBarVirtualDom from '../GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as GetSelectionVirtualDom from '../GetSelectionVirtualDom/GetSelectionVirtualDom.ts'

const errorNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorError,
  type: VirtualDomElements.Div,
}

const getErrorDom = (errorMessage: string | undefined): readonly VirtualDomNode[] => {
  if (!errorMessage) {
    return []
  }
  return [
    errorNode,
    {
      text: errorMessage,
      type: VirtualDomElements.Text,
    },
  ]
}

export const getEditorVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { diagnostics, errorMessage, lineNumbers, lines, minLineY, scrollBarWidth, selections, tokenizedLines } = state
  const diagnosticsDom = GetDiagnosticsVirtualDom.getDiagnosticsVirtualDom(diagnostics)
  const findWidgetDom = GetFindWidgetVirtualDom.getFindWidgetVirtualDom(state)
  const lineNumbersDom = lineNumbers ? GetLineNumbersVirtualDom.getLineNumbersVirtualDom(lines, minLineY) : []
  const scrollBarDom = GetScrollBarVirtualDom.getScrollBarVirtualDom(scrollBarWidth)
  const selectionDom = GetSelectionVirtualDom.getSelectionVirtualDom(state)
  const errorDom = getErrorDom(errorMessage)
  const cursorCount = selections.length / 4
  return [
    {
      childCount: 2 + (findWidgetDom.length > 0 ? 1 : 0) + (errorMessage ? 1 : 0),
      className: ClassNames.Editor,
      type: VirtualDomElements.Div,
    },
    ...GetEditorInputVirtualDom.getEditorInputVirtualDom(),
    {
      childCount:
        1 + cursorCount + selectionDom.length + (lineNumbers ? 1 : 0) + (diagnosticsDom.length > 0 ? 1 : 0) + (scrollBarDom.length > 0 ? 1 : 0),
      className: ClassNames.EditorContent,
      onClick: DomEventListenerFunctions.HandleClick,
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      onPointerMove: DomEventListenerFunctions.HandlePointerMove,
      onPointerUp: DomEventListenerFunctions.HandlePointerUp,
      onWheel: DomEventListenerFunctions.HandleWheel,
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    ...lineNumbersDom,
    ...GetLinesVirtualDom.getLinesVirtualDom(tokenizedLines),
    ...diagnosticsDom,
    ...scrollBarDom,
    ...selectionDom,
    ...GetCursorVirtualDom.getCursorVirtualDom(state),
    ...errorDom,
    ...findWidgetDom,
  ]
}
