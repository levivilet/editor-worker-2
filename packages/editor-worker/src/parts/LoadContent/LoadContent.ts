import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetLines from '../GetLines/GetLines.ts'

export const loadContent = async (uid: number): Promise<void> => {
  const state = EditorStates.get(uid)
  const { uri } = state
  const content = await FileSystemWorker.readFile(uri)
  const lines = GetLines.getLines(content)
  EditorStates.set({
    ...state,
    lines,
  })
}
