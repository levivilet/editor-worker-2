import type { EditorState } from '../EditorState/EditorState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const create = (
  uid: number,
  uri = '',
  _x = 0,
  _y = 0,
  width = 0,
  _height = 0,
  _platform = 0,
  _assetDir = '',
  languageId = 'plaintext',
  tokenizePath = '',
): EditorState => {
  return EditorStates.create(uid, uri, languageId, tokenizePath, width)
}
