import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as GetClickPosition from '../GetClickPosition/GetClickPosition.ts'
import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

const getDocumentPosition = async (uid: number, eventX: number, eventY: number): Promise<readonly [number, number]> => {
  const state = EditorStates.get(uid)
  const { minLineY } = state
  const position = await GetClickPosition.getClickPosition(state, eventX, eventY)
  return [minLineY + position.rowIndex, position.columnIndex]
}

export const pointerDown = async (uid: number, eventX: number, eventY: number): Promise<void> => {
  const anchor = await getDocumentPosition(uid, eventX, eventY)
  EditorStates.set({
    ...EditorStates.get(uid),
    pointerAnchor: anchor,
    pointerSelecting: true,
  })
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setSelections', [...anchor, ...anchor])
}

export const pointerMove = async (uid: number, eventX: number, eventY: number, buttons = 0): Promise<void> => {
  const state = EditorStates.get(uid)
  const { pointerAnchor, pointerSelecting } = state
  if (!pointerSelecting || buttons === 0) {
    return
  }
  const active = await getDocumentPosition(uid, eventX, eventY)
  const anchor = pointerAnchor ?? active
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setSelections', [...anchor, ...active])
}

export const pointerUp = async (uid: number, eventX: number, eventY: number): Promise<void> => {
  const state = EditorStates.get(uid)
  const { pointerAnchor, pointerSelecting } = state
  if (pointerSelecting) {
    const active = await getDocumentPosition(uid, eventX, eventY)
    const anchor = pointerAnchor ?? active
    await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setSelections', [...anchor, ...active])
  }
  EditorStates.set({
    ...EditorStates.get(uid),
    pointerSelecting: false,
  })
}
