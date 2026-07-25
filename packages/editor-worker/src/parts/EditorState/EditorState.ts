import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { FindWidgetHandle } from '../FindWidgetHandle/FindWidgetHandle.ts'

export interface EditorState {
  readonly canRedo: boolean
  readonly canUndo: boolean
  readonly columnWidth: number
  readonly diagnostics: readonly Diagnostic[]
  readonly errorMessage?: string
  readonly findWidget?: FindWidgetHandle
  readonly findWidgetInstanceSequence?: number
  readonly findWidgetIntentSequence?: number
  readonly findWidgetVisible: boolean
  readonly height: number
  readonly languageId: string
  readonly lineCount: number
  readonly lineNumbers: boolean
  readonly lines: readonly string[]
  readonly longestLineWidth: number
  readonly maxLineY: number
  readonly minLineY: number
  readonly modified: boolean
  readonly pointerAnchor?: readonly [number, number]
  readonly pointerSelecting?: boolean
  readonly rowHeight: number
  readonly scrollBarWidth: number
  readonly scrollLeft: number
  readonly scrollTop: number
  readonly selections: Uint32Array
  readonly tokenizedLines: readonly (readonly string[])[]
  readonly tokenizePath: string
  readonly uid: number
  readonly uri: string
  readonly useCache: boolean
  readonly version: number
  readonly width: number
  readonly x: number
  readonly y: number
}
