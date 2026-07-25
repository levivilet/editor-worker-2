import * as EditorCommandQueue from '../EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as FindWidgetLifecycle from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

const disposeEditorState = (uid: number): readonly never[] => {
  EditorCommandQueue.dispose(uid)
  EditorStates.dispose(uid)
  TextDocumentWorker.send('TextDocument.dispose', uid)
  return []
}

export const dispose = (uid: number): readonly never[] => {
  const state = EditorStates.get(uid)
  const { findWidget } = state
  if (findWidget) {
    void FindWidgetLifecycle.close(uid).then(
      () => disposeEditorState(uid),
      () => disposeEditorState(uid),
    )
    return []
  }
  return disposeEditorState(uid)
}

export const disposeAsync = async (uid: number): Promise<readonly never[]> => {
  const { findWidget } = EditorStates.get(uid)
  if (findWidget) {
    await FindWidgetLifecycle.close(uid)
  }
  return disposeEditorState(uid)
}
