import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'

export interface EditorState {
  readonly columnWidth: number
  readonly diagnostics: readonly Diagnostic[]
  readonly findWidgetVisible: boolean
  readonly height: number
  readonly languageId: string
  readonly lineCount: number
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly longestLineWidth: number
  readonly maxLineY: number
  readonly minLineY: number
  readonly rowHeight: number
  readonly scrollBarWidth: number
  readonly selections: Uint32Array
  readonly tokenizedLines: readonly (readonly string[])[]
  readonly tokenizePath: string
  readonly uid: number
  readonly uri: string
  readonly useCache: boolean
  readonly width: number
  readonly x: number
  readonly y: number
}
