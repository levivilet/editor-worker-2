import { ClipBoardWorker, ExtensionManagementWorker, FileSystemWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import { createClipBoardWorkerRpc } from '../CreateClipBoardWorkerRpc/CreateClipBoardWorkerRpc.ts'
import { createExtensionManagementWorkerRpc } from '../CreateExtensionManagementWorkerRpc/CreateExtensionManagementWorkerRpc.ts'
import { createFileSystemWorkerRpc } from '../CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'
import { createRendererWorkerRpc } from '../CreateRendererWorkerRpc/CreateRendererWorkerRpc.ts'

export const initializeWorkerConnections = async (): Promise<void> => {
  const [fileSystemRpc, extensionManagementRpc, clipBoardRpc] = await Promise.all([
    createFileSystemWorkerRpc(),
    createExtensionManagementWorkerRpc(),
    createClipBoardWorkerRpc(),
  ])

  FileSystemWorker.set(fileSystemRpc)
  ExtensionManagementWorker.set(extensionManagementRpc)
  ClipBoardWorker.set(clipBoardRpc)
}

export const listen = async (): Promise<void> => {
  const rendererRpc = await createRendererWorkerRpc()
  RendererWorker.set(rendererRpc)
  await initializeWorkerConnections()
}
