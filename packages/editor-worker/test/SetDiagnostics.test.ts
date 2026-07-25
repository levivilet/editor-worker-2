import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { Diagnostic } from '../src/parts/Diagnostic/Diagnostic.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getEditorVirtualDom } from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'
import { setDiagnostics } from '../src/parts/SetDiagnostics/SetDiagnostics.ts'

const createDiagnostics = (count: number): readonly Diagnostic[] => {
  return Array.from({ length: count }, (_, index) => ({
    height: 2,
    type: index % 2 === 0 ? 'error' : 'warning',
    width: 8,
    x: index,
    y: index * 20,
  }))
}

test.each([0, 1, 2, 10, 100, 1000])('sets and renders %i diagnostics', (count) => {
  const uid = count + 1
  create(uid)
  const diagnostics = createDiagnostics(count)

  setDiagnostics(uid, diagnostics)

  const state = EditorStates.get(uid)
  const { diagnostics: actualDiagnostics } = state
  expect(actualDiagnostics).toBe(diagnostics)

  const diagnosticDom = getEditorVirtualDom(state).slice(1)
  const expectedDiagnosticDom =
    count === 0
      ? []
      : [
          {
            childCount: count,
            className: ClassNames.LayerDiagnostics,
            type: VirtualDomElements.Div,
          },
          ...diagnostics.map((diagnostic) => ({
            childCount: 0,
            className: MergeClassNames.mergeClassNames(
              ClassNames.Diagnostic,
              diagnostic.type === 'warning' ? ClassNames.DiagnosticWarning : ClassNames.DiagnosticError,
            ),
            height: diagnostic.height,
            left: diagnostic.x,
            top: diagnostic.y,
            type: VirtualDomElements.Div,
            width: diagnostic.width,
          })),
        ]
  expect(diagnosticDom).toEqual(expectedDiagnosticDom)

  expect(dispose(uid)).toEqual([])
})
