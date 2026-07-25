import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const setDiagnostics = (uid: number, diagnostics: readonly Diagnostic[]): void => {
  const state = EditorStates.get(uid)
  EditorStates.set({
    ...state,
    diagnostics,
  })
}
