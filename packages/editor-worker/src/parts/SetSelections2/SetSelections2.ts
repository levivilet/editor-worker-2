import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'

export const setSelections2 = async (uid: number, selections: Uint32Array): Promise<void> => {
  if (selections.length === 0 || selections.length % 4 !== 0) {
    throw new Error('Editor selections must contain one or more groups of four values')
  }
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.setSelections', [...selections])
}
