import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

export const createFileSystemWorkerRpc = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port) => RendererWorker.sendMessagePortToFileSystemWorker(port, RpcId.EditorWorker),
  })
}
