import type { EditorState } from '../EditorState/EditorState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const create = (uid: number, uri = ''): EditorState => {
  return EditorStates.create(uid, uri)
}
