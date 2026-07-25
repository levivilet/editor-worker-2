import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetClickPosition from '../GetClickPosition/GetClickPosition.ts'

export const handleClick = (uid: number, eventX: number, eventY: number): void => {
  const state = EditorStates.get(uid)
  const position = GetClickPosition.getClickPosition(state, eventX, eventY)
  const { columnIndex, rowIndex } = position
  EditorStates.set({
    ...state,
    selections: new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]),
  })
}
