import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLongestLineWidth from '../GetLongestLineWidth/GetLongestLineWidth.ts'
import * as GetScrollBarWidth from '../GetScrollBarWidth/GetScrollBarWidth.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const handleInput = async (uid: number, content: string): Promise<void> => {
  const state = EditorStates.get(uid)
  const { columnWidth, languageId, tokenizePath, width } = state
  const rpc = await TextDocumentWorker.get()
  const lineCount = await rpc.invoke('TextDocument.setContent', uid, content)
  const minLineY = 0
  const maxLineY = lineCount
  const lines = await rpc.invoke('TextDocument.getLines', uid, minLineY, maxLineY)
  const visibleContent = lines.join('\n')
  const tokenizedLines = await HighlightLines.highlightLines(visibleContent, languageId, tokenizePath, lines)
  const longestLineWidth = GetLongestLineWidth.getLongestLineWidth(lines, columnWidth)
  const scrollBarWidth = GetScrollBarWidth.getScrollBarWidth(width, longestLineWidth)
  EditorStates.set({
    ...state,
    lineCount,
    lines,
    longestLineWidth,
    maxLineY,
    minLineY,
    scrollBarWidth,
    tokenizedLines,
  })
}
