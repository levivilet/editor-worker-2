import { createMockRpc } from '@lvce-editor/rpc'
import { commandMap } from '../../text-document-worker/src/parts/CommandMap/CommandMap.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'

export const registerMockTextDocumentWorker = (): ReturnType<typeof createMockRpc> => {
  const rpc = createMockRpc({ commandMap })
  TextDocumentWorker.set(rpc)
  return rpc
}
