import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { RendererWorker, RpcId } from '@lvce-editor/rpc-registry'

export const createExtensionManagementWorkerRpc = (): Promise<Rpc> => {
  return LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port) => RendererWorker.sendMessagePortToExtensionManagementWorker(port, RpcId.EditorWorker),
  })
}
