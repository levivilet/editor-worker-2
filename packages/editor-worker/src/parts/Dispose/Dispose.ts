import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const dispose = (uid: number): readonly never[] => {
  EditorStates.dispose(uid)
  TextDocumentWorker.send('TextDocument.dispose', uid)
  return []
}
