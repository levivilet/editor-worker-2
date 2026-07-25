import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLines from '../GetLines/GetLines.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'

export const loadContent = async (uid: number): Promise<void> => {
  const state = EditorStates.get(uid)
  const { languageId, tokenizePath, uri } = state
  const content = await FileSystemWorker.readFile(uri)
  const lines = GetLines.getLines(content)
  const tokenizedLines = await HighlightLines.highlightLines(content, languageId, tokenizePath, lines)
  EditorStates.set({
    ...state,
    lines,
    tokenizedLines,
  })
}
