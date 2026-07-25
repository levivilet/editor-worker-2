import type { TextDocumentSnapshot } from '../TextDocumentSnapshot/TextDocumentSnapshot.ts'
import * as ApplyTextDocumentSnapshot from '../ApplyTextDocumentSnapshot/ApplyTextDocumentSnapshot.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

const clamp = (value: number, minimum: number, maximum: number): number => Math.min(Math.max(value, minimum), maximum)

export const handleWheel = async (uid: number, deltaMode: number, deltaX: number, deltaY: number): Promise<void> => {
  const state = EditorStates.get(uid)
  const { height, lineCount, longestLineWidth, rowHeight, scrollLeft, scrollTop, width } = state
  let multiplier = 1
  if (deltaMode === 1) {
    multiplier = rowHeight
  } else if (deltaMode === 2) {
    multiplier = height
  }
  const maxScrollTop = Math.max(0, lineCount * rowHeight - height)
  const maxScrollLeft = Math.max(0, longestLineWidth - width)
  EditorStates.set({
    ...state,
    scrollLeft: clamp(scrollLeft + deltaX * multiplier, 0, maxScrollLeft),
    scrollTop: clamp(scrollTop + deltaY * multiplier, 0, maxScrollTop),
  })
  const rpc = await TextDocumentWorker.get()
  const snapshot = (await rpc.invoke('TextDocument.getSnapshot', uid)) as TextDocumentSnapshot
  await ApplyTextDocumentSnapshot.applyTextDocumentSnapshot(uid, snapshot, false)
}
