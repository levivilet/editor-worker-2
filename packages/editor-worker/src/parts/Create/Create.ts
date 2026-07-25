import type { EditorState } from '../EditorState/EditorState.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const create = (
  uid: number,
  uri = '',
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  _platform = 0,
  _assetDir = '',
  languageId = 'plaintext',
  tokenizePath = '',
): EditorState => {
  return EditorStates.create(uid, uri, languageId, tokenizePath, x, y, width, height)
}
