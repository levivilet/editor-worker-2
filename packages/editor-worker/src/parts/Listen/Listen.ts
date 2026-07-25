import { LazyTransferMessagePortRpcParent, WebWorkerRpcClient } from '@lvce-editor/rpc'
import { ClipBoardWorker, ExtensionManagementWorker, FileSystemWorker, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const initializeWorkerConnections = async (): Promise<void> => {
  const [fileSystemRpc, extensionManagementRpc, clipBoardRpc] = await Promise.all([
    LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: (port) => RendererWorker.sendMessagePortToFileSystemWorker(port, RpcId.EditorWorker),
    }),
    LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: (port) => RendererWorker.sendMessagePortToExtensionManagementWorker(port, RpcId.EditorWorker),
    }),
    LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: (port) => RendererWorker.sendMessagePortToClipBoardWorker(port, RpcId.EditorWorker),
    }),
  ])

  FileSystemWorker.set(fileSystemRpc)
  ExtensionManagementWorker.set(extensionManagementRpc)
  ClipBoardWorker.set(clipBoardRpc)
}

export const listen = async (): Promise<void> => {
  const rendererRpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rendererRpc)
  await initializeWorkerConnections()
}
