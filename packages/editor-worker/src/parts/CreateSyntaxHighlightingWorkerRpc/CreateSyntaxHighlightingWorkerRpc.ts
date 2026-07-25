import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createSyntaxHighlightingWorkerRpc = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port) => RendererWorker.sendMessagePortToSyntaxHighlightingWorker(port),
  })
}
