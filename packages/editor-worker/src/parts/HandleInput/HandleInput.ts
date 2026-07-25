import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLines from '../GetLines/GetLines.ts'
import * as HighlightLines from '../HighlightLines/HighlightLines.ts'

export const handleInput = async (uid: number, content: string): Promise<void> => {
  const state = EditorStates.get(uid)
  const { languageId, tokenizePath } = state
  const lines = GetLines.getLines(content)
  const tokenizedLines = await HighlightLines.highlightLines(content, languageId, tokenizePath, lines)
  EditorStates.set({
    ...state,
    content,
    lines,
    tokenizedLines,
  })
}
