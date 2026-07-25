import { createMockRpc } from '@lvce-editor/rpc'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'

export const registerMockTextDocumentWorker = (): ReturnType<typeof createMockRpc> => {
  const documents = new Map<number, readonly string[]>()
  const rpc = createMockRpc({
    commandMap: {
      'TextDocument.dispose': (id: number): void => {
        documents.delete(id)
      },
      'TextDocument.getLines': (id: number, startLineIndex: number, endLineIndex: number): readonly string[] => {
        return documents.get(id)?.slice(startLineIndex, endLineIndex) || []
      },
      'TextDocument.setContent': (id: number, content: string): number => {
        const lines = content.split(/\r\n|\n|\r/)
        documents.set(id, lines)
        return lines.length
      },
    },
  })
  TextDocumentWorker.set(rpc)
  return rpc
}
