import * as EditorStates from '../EditorStates/EditorStates.ts'

export const dispose = (uid: number): readonly never[] => {
  EditorStates.dispose(uid)
  return []
}
