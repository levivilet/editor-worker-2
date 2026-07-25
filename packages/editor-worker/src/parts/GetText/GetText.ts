import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

export const getText = async (uid: number): Promise<string> => {
  const rpc = await TextDocumentWorker.get()
  return (await rpc.invoke('TextDocument.getText', uid)) as string
}
