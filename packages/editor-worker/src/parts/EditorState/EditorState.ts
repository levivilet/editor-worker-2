import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export interface EditorState {
  readonly diagnostics: readonly Diagnostic[]
  readonly languageId: string
  readonly lines: readonly string[]
  readonly tokenizedLines: readonly (readonly string[])[]
  readonly tokenizePath: string
  readonly uid: number
  readonly uri: string
}
