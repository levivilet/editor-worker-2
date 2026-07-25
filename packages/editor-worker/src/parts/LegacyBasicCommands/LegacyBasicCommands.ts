import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'
import * as SetSelections2 from '../SetSelections2/SetSelections2.ts'
import * as TextDocumentCommands from '../TextDocumentCommands/TextDocumentCommands.ts'

export const cursorSet = (uid: number, rowIndex: number, columnIndex: number): Promise<void> => {
  return SetSelections2.setSelections2(uid, new Uint32Array([rowIndex, columnIndex, rowIndex, columnIndex]))
}

export const setSelections = (uid: number, selections: Uint32Array): Promise<void> => {
  return SetSelections2.setSelections2(uid, selections)
}

export const getSelections = (uid: number): readonly number[] => {
  return [...EditorStates.get(uid).selections]
}

export const cancelSelection = (uid: number): Promise<void> => {
  const { selections } = EditorStates.get(uid)
  const activeRowIndex = selections[2]
  const activeColumnIndex = selections[3]
  return cursorSet(uid, activeRowIndex, activeColumnIndex)
}

export const deleteAll = async (uid: number): Promise<void> => {
  await TextDocumentCommands.selectAll(uid)
  await TextDocumentCommands.type(uid, '')
}

export const setText = (uid: number, text: string): Promise<void> => {
  return RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setContent', text)
}
