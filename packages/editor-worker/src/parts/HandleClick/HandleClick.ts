import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetClickPosition from '../GetClickPosition/GetClickPosition.ts'
import * as GetWordSelection from '../GetWordSelection/GetWordSelection.ts'
import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

export const handleClick = async (uid: number, eventX: number, eventY: number, clickCount = 1): Promise<void> => {
  const state = EditorStates.get(uid)
  const { lines, minLineY } = state
  const position = await GetClickPosition.getClickPosition(state, eventX, eventY)
  const { columnIndex, rowIndex } = position
  const documentRowIndex = minLineY + rowIndex
  const selections =
    clickCount === 2
      ? GetWordSelection.getWordSelection(lines[rowIndex] ?? '', documentRowIndex, columnIndex)
      : new Uint32Array([documentRowIndex, columnIndex, documentRowIndex, columnIndex])
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setSelections', [...selections])
}
