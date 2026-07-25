export interface TextDocumentSnapshot {
  readonly canRedo: boolean
  readonly canUndo: boolean
  readonly lineCount: number
  readonly longestLineLength: number
  readonly modified: boolean
  readonly selections: readonly number[]
  readonly version: number
}
