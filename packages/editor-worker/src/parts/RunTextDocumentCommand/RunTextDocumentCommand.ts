import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as ApplyTextDocumentSnapshot from '../ApplyTextDocumentSnapshot/ApplyTextDocumentSnapshot.ts'
import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const runTextDocumentCommand = async (uid: number, method: string, ...params: readonly unknown[]): Promise<void> => {
  await EditorCommandQueue.enqueue(uid, async () => {
    const rpc = await TextDocumentWorker.get()
    const snapshot = (await rpc.invoke(method, uid, ...params)) as TextDocumentSnapshot
    await ApplyTextDocumentSnapshot.applyTextDocumentSnapshot(uid, snapshot)
  })
}
