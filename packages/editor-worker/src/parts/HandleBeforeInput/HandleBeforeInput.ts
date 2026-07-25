import * as TextDocumentCommands from '../TextDocumentCommands/TextDocumentCommands.ts'

const commands: Readonly<Record<string, (uid: number, data: string) => Promise<void>>> = {
  deleteContentBackward: (uid) => TextDocumentCommands.deleteCharacterLeft(uid),
  deleteContentForward: (uid) => TextDocumentCommands.deleteCharacterRight(uid),
  deleteHardLineBackward: (uid) => TextDocumentCommands.deleteAllLeft(uid),
  deleteHardLineForward: (uid) => TextDocumentCommands.deleteAllRight(uid),
  deleteSoftLineBackward: (uid) => TextDocumentCommands.deleteAllLeft(uid),
  deleteSoftLineForward: (uid) => TextDocumentCommands.deleteAllRight(uid),
  deleteWordBackward: (uid) => TextDocumentCommands.deleteWordLeft(uid),
  deleteWordForward: (uid) => TextDocumentCommands.deleteWordRight(uid),
  historyRedo: (uid) => TextDocumentCommands.redo(uid),
  historyUndo: (uid) => TextDocumentCommands.undo(uid),
  insertLineBreak: (uid) => TextDocumentCommands.insertLineBreak(uid),
  insertParagraph: (uid) => TextDocumentCommands.insertLineBreak(uid),
  insertReplacementText: (uid, data) => TextDocumentCommands.type(uid, data),
  insertText: (uid, data) => TextDocumentCommands.type(uid, data),
}

export const handleBeforeInput = async (uid: number, inputType: string, data: string | null = ''): Promise<void> => {
  const command = commands[inputType]
  if (command) {
    await command(uid, data ?? '')
  }
}
