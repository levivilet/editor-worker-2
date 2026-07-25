import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as ApplyTextDocumentSnapshot from '../ApplyTextDocumentSnapshot/ApplyTextDocumentSnapshot.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetFileContent from '../GetFileContent/GetFileContent.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const loadContent = async (uid: number): Promise<void> => {
  await EditorCommandQueue.enqueue(uid, async () => {
    const { uri, useCache } = EditorStates.get(uid)
    try {
      const content = await GetFileContent.getFileContent(uri, useCache)
      const rpc = await TextDocumentWorker.get()
      const snapshot = (await rpc.invoke('TextDocument.setContent', uid, content)) as TextDocumentSnapshot
      EditorStates.set({
        ...EditorStates.get(uid),
        errorMessage: '',
      })
      await ApplyTextDocumentSnapshot.applyTextDocumentSnapshot(uid, snapshot)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      EditorStates.set({
        ...EditorStates.get(uid),
        errorMessage: `Could not load ${uri}: ${message}`,
      })
    }
  })
}
