import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export interface EditorState {
  readonly diagnostics: readonly Diagnostic[]
  readonly lines: readonly string[]
  readonly uid: number
  readonly uri: string
}
