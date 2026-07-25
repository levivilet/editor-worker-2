import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLines from '../GetLines/GetLines.ts'
import * as GetLongestLineWidth from '../GetLongestLineWidth/GetLongestLineWidth.ts'
import * as GetScrollBarWidth from '../GetScrollBarWidth/GetScrollBarWidth.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'

export const loadContent = async (uid: number): Promise<void> => {
  const state = EditorStates.get(uid)
  const { columnWidth, languageId, tokenizePath, uri, width } = state
  const content = await FileSystemWorker.readFile(uri)
  const lines = GetLines.getLines(content)
  const tokenizedLines = await HighlightLines.highlightLines(content, languageId, tokenizePath, lines)
  const longestLineWidth = GetLongestLineWidth.getLongestLineWidth(lines, columnWidth)
  const scrollBarWidth = GetScrollBarWidth.getScrollBarWidth(width, longestLineWidth)
  EditorStates.set({
    ...state,
    content,
    lines,
    longestLineWidth,
    scrollBarWidth,
    tokenizedLines,
  })
}
