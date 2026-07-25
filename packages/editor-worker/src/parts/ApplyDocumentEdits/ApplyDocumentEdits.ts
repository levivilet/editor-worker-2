import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

export const applyDocumentEdits = async (uid: number, edits: readonly unknown[]): Promise<void> => {
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.applyEdits', edits)
}
