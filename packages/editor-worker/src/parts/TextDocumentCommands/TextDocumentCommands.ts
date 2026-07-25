import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

const command = (method: string) => {
  return (uid: number): Promise<void> => RunTextDocumentCommand.runTextDocumentCommand(uid, method)
}

export const cursorDocumentEnd = command('TextDocument.cursorDocumentEnd')
export const cursorDocumentStart = command('TextDocument.cursorDocumentStart')
export const cursorDown = command('TextDocument.cursorDown')
export const cursorEnd = command('TextDocument.cursorEnd')
export const cursorHome = command('TextDocument.cursorHome')
export const cursorLeft = command('TextDocument.cursorLeft')
export const cursorRight = command('TextDocument.cursorRight')
export const cursorUp = command('TextDocument.cursorUp')
export const cursorWordLeft = command('TextDocument.cursorWordLeft')
export const cursorWordRight = command('TextDocument.cursorWordRight')
export const deleteAllLeft = command('TextDocument.deleteAllLeft')
export const deleteAllRight = command('TextDocument.deleteAllRight')
export const deleteCharacterLeft = command('TextDocument.deleteCharacterLeft')
export const deleteCharacterRight = command('TextDocument.deleteCharacterRight')
export const deleteLine = command('TextDocument.deleteLine')
export const deleteWordLeft = command('TextDocument.deleteWordLeft')
export const deleteWordRight = command('TextDocument.deleteWordRight')
export const indent = command('TextDocument.indent')
export const insertLineBreak = command('TextDocument.insertLineBreak')
export const insertTab = command('TextDocument.insertTab')
export const redo = command('TextDocument.redo')
export const selectAll = command('TextDocument.selectAll')
export const selectDown = command('TextDocument.selectDown')
export const selectDocumentEnd = command('TextDocument.selectDocumentEnd')
export const selectDocumentStart = command('TextDocument.selectDocumentStart')
export const selectEnd = command('TextDocument.selectEnd')
export const selectHome = command('TextDocument.selectHome')
export const selectLeft = command('TextDocument.selectLeft')
export const selectRight = command('TextDocument.selectRight')
export const selectUp = command('TextDocument.selectUp')
export const selectWordLeft = command('TextDocument.selectWordLeft')
export const selectWordRight = command('TextDocument.selectWordRight')
export const undo = command('TextDocument.undo')
export const unindent = command('TextDocument.unindent')

export const type = (uid: number, text: string): Promise<void> => {
  return RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.type', text)
}

export const pasteText = (uid: number, text: string): Promise<void> => {
  return RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.pasteText', text)
}
