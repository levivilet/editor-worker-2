import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetClickPosition from '../GetClickPosition/GetClickPosition.ts'
import * as GetWordSelection from '../GetWordSelection/GetWordSelection.ts'

export const handleClick = async (uid: number, eventX: number, eventY: number, clickCount = 1): Promise<void> => {
  const state = EditorStates.get(uid)
  const { lines } = state
  const position = await GetClickPosition.getClickPosition(state, eventX, eventY)
  const { columnIndex, rowIndex } = position
  const selections =
    clickCount === 2
      ? GetWordSelection.getWordSelection(lines[rowIndex] ?? '', rowIndex, columnIndex)
      : new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex])
  EditorStates.set({
    ...state,
    selections,
  })
}
