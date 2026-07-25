import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export interface EditorState {
  readonly columnWidth: number
  readonly content: string
  readonly diagnostics: readonly Diagnostic[]
  readonly height: number
  readonly languageId: string
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly longestLineWidth: number
  readonly rowHeight: number
  readonly scrollBarWidth: number
  readonly selections: Uint32Array
  readonly tokenizedLines: readonly (readonly string[])[]
  readonly tokenizePath: string
  readonly uid: number
  readonly uri: string
  readonly width: number
  readonly x: number
  readonly y: number
}
