import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetScrollBarWidth from '../GetScrollBarWidth/GetScrollBarWidth.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

const Overscan = 10

const getVisibleRange = (
  lineCount: number,
  height: number,
  rowHeight: number,
  scrollTop: number,
): { readonly maxLineY: number; readonly minLineY: number } => {
  const visibleLineCount = height <= 0 ? lineCount : Math.ceil(height / rowHeight)
  const firstVisibleLine = Math.floor(scrollTop / rowHeight)
  const minLineY = Math.max(0, firstVisibleLine - Overscan)
  const maxLineY = Math.min(lineCount, firstVisibleLine + visibleLineCount + Overscan)
  return {
    maxLineY,
    minLineY,
  }
}

export const applyTextDocumentSnapshot = async (uid: number, snapshot: TextDocumentSnapshot): Promise<void> => {
  const state = EditorStates.get(uid)
  const { columnWidth, height, languageId, rowHeight, scrollTop, tokenizePath, width } = state
  const { maxLineY, minLineY } = getVisibleRange(snapshot.lineCount, height, rowHeight, scrollTop)
  const rpc = await TextDocumentWorker.get()
  const lines = (await rpc.invoke('TextDocument.getLines', uid, minLineY, maxLineY)) as readonly string[]
  const visibleContent = lines.join('\n')
  const tokenizedLines = await HighlightLines.highlightLines(visibleContent, languageId, tokenizePath, lines)
  const longestLineWidth = snapshot.longestLineLength * columnWidth
  const scrollBarWidth = GetScrollBarWidth.getScrollBarWidth(width, longestLineWidth)
  EditorStates.set({
    ...state,
    canRedo: snapshot.canRedo,
    canUndo: snapshot.canUndo,
    lineCount: snapshot.lineCount,
    lines,
    longestLineWidth,
    maxLineY,
    minLineY,
    modified: snapshot.modified,
    scrollBarWidth,
    selections: new Uint32Array(snapshot.selections),
    tokenizedLines,
    version: snapshot.version,
  })
}
