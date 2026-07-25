import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import * as RunTextDocumentCommand from '../RunTextDocumentCommand/RunTextDocumentCommand.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const copy = async (uid: number): Promise<void> => {
  const rpc = await TextDocumentWorker.get()
  const text = (await rpc.invoke('TextDocument.getSelectedText', uid)) as string
  await ClipBoardWorker.invoke('ClipBoard.writeText', text)
}

export const cut = async (uid: number): Promise<void> => {
  await copy(uid)
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.type', '')
}

export const paste = async (uid: number): Promise<void> => {
  const text = (await ClipBoardWorker.invoke('ClipBoard.readText')) as string
  await RunTextDocumentCommand.runTextDocumentCommand(uid, 'TextDocument.pasteText', text)
}
