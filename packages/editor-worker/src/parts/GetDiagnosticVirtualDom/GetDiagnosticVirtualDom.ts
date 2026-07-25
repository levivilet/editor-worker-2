import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetDiagnosticClassName from '../GetDiagnosticClassName/GetDiagnosticClassName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getDiagnosticVirtualDom = (diagnostic: Diagnostic): VirtualDomNode => {
  const { height, type, width, x, y } = diagnostic
  const diagnosticClassName = GetDiagnosticClassName.getDiagnosticClassName(type)
  return {
    childCount: 0,
    className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, diagnosticClassName),
    height,
    left: x,
    top: y,
    type: VirtualDomElements.Div,
    width,
  }
}
