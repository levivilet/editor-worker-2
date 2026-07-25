import * as EditorStates from '../EditorStates/EditorStates.ts'

export const getSelections2 = (uid: number): readonly number[] => {
  return [...EditorStates.get(uid).selections]
}
