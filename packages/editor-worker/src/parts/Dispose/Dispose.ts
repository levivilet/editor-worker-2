import * as EditorStates from '../EditorStates/EditorStates.ts'

export const dispose = (uid: number): void => {
  EditorStates.dispose(uid)
}
