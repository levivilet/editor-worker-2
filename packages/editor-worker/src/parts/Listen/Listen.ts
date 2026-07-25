import { ClipBoardWorker, ExtensionManagementWorker, FileSystemWorker, RendererWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { createClipBoardWorkerRpc } from '../CreateClipBoardWorkerRpc/CreateClipBoardWorkerRpc.ts'
import { createExtensionManagementWorkerRpc } from '../CreateExtensionManagementWorkerRpc/CreateExtensionManagementWorkerRpc.ts'
import { createFileSystemWorkerRpc } from '../CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'
import { createRendererWorkerRpc } from '../CreateRendererWorkerRpc/CreateRendererWorkerRpc.ts'
import { createSyntaxHighlightingWorkerRpc } from '../CreateSyntaxHighlightingWorkerRpc/CreateSyntaxHighlightingWorkerRpc.ts'

export const initializeWorkerConnections = async (): Promise<void> => {
  const [fileSystemRpc, extensionManagementRpc, clipBoardRpc, syntaxHighlightingRpc] = await Promise.all([
    createFileSystemWorkerRpc(),
    createExtensionManagementWorkerRpc(),
    createClipBoardWorkerRpc(),
    createSyntaxHighlightingWorkerRpc(),
  ])

  FileSystemWorker.set(fileSystemRpc)
  ExtensionManagementWorker.set(extensionManagementRpc)
  ClipBoardWorker.set(clipBoardRpc)
  SyntaxHighlightingWorker.set(syntaxHighlightingRpc)
}

export const listen = async (): Promise<void> => {
  const rendererRpc = await createRendererWorkerRpc()
  RendererWorker.set(rendererRpc)
  await initializeWorkerConnections()
}
