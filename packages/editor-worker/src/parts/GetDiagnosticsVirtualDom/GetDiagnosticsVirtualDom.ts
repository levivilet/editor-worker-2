import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticVirtualDom from '../GetDiagnosticVirtualDom/GetDiagnosticVirtualDom.ts'

export const getDiagnosticsVirtualDom = (diagnostics: readonly Diagnostic[]): readonly VirtualDomNode[] => {
  if (diagnostics.length === 0) {
    return []
  }
  return [
    {
      childCount: diagnostics.length,
      className: ClassNames.LayerDiagnostics,
      type: VirtualDomElements.Div,
    },
    ...diagnostics.map(GetDiagnosticVirtualDom.getDiagnosticVirtualDom),
  ]
}
