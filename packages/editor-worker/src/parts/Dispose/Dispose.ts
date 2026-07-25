import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const dispose = (uid: number): readonly never[] => {
  EditorCommandQueue.dispose(uid)
  EditorStates.dispose(uid)
  TextDocumentWorker.send('TextDocument.dispose', uid)
  return []
}
