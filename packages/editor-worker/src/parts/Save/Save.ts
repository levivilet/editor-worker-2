import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as ApplyTextDocumentSnapshot from '../ApplyTextDocumentSnapshot/ApplyTextDocumentSnapshot.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const save = async (uid: number): Promise<void> => {
  await EditorCommandQueue.enqueue(uid, async () => {
    const state = EditorStates.get(uid)
    const { uri, version } = state
    const rpc = await TextDocumentWorker.get()
    const content = (await rpc.invoke('TextDocument.getText', uid)) as string
    try {
      await FileSystemWorker.invoke('FileSystem.writeFile', uri, content)
      const snapshot = (await rpc.invoke('TextDocument.markSaved', uid, version)) as TextDocumentSnapshot
      EditorStates.set({
        ...EditorStates.get(uid),
        errorMessage: '',
      })
      await ApplyTextDocumentSnapshot.applyTextDocumentSnapshot(uid, snapshot)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      EditorStates.set({
        ...EditorStates.get(uid),
        errorMessage: `Could not save ${uri}: ${message}`,
      })
    }
  })
}
