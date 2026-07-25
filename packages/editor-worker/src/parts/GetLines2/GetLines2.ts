import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const getLines2 = async (uid: number): Promise<readonly string[]> => {
  const { lineCount } = EditorStates.get(uid)
  const rpc = await TextDocumentWorker.get()
  return rpc.invoke('TextDocument.getLines', uid, 0, lineCount)
}
