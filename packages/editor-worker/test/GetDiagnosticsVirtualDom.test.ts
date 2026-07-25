import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getDiagnosticsVirtualDom } from '../src/parts/GetDiagnosticsVirtualDom/GetDiagnosticsVirtualDom.ts'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'

test('does not render an empty diagnostics layer', () => {
  expect(getDiagnosticsVirtualDom([])).toEqual([])
})

test('renders diagnostics inside a div', () => {
  expect(
    getDiagnosticsVirtualDom([
      {
        height: 16,
        type: 'error',
        width: 12,
        x: 4,
        y: 6,
      },
      {
        height: 16,
        type: 'warning',
        width: 20,
        x: 8,
        y: 26,
      },
    ]),
  ).toEqual([
    {
      childCount: 2,
      className: 'LayerDiagnostics',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, ClassNames.DiagnosticError),
      height: 16,
      left: 4,
      top: 6,
      type: VirtualDomElements.Div,
      width: 12,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.Diagnostic, ClassNames.DiagnosticWarning),
      height: 16,
      left: 8,
      top: 26,
      type: VirtualDomElements.Div,
      width: 20,
    },
  ])
})
