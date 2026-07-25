import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as ApplyTextDocumentSnapshot from '../ApplyTextDocumentSnapshot/ApplyTextDocumentSnapshot.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const resize = async (uid: number, dimensions: Readonly<{ height?: number; width?: number; x?: number; y?: number }>): Promise<void> => {
  const state = EditorStates.get(uid)
  const { height, width, x, y } = state
  EditorStates.set({
    ...state,
    height: dimensions.height ?? height,
    width: dimensions.width ?? width,
    x: dimensions.x ?? x,
    y: dimensions.y ?? y,
  })
  const rpc = await TextDocumentWorker.get()
  const snapshot = (await rpc.invoke('TextDocument.getSnapshot', uid)) as TextDocumentSnapshot
  await ApplyTextDocumentSnapshot.applyTextDocumentSnapshot(uid, snapshot)
}
