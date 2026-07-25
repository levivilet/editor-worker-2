import {
  ClipBoardWorker,
  ExtensionManagementWorker,
  FileSystemWorker,
  RendererWorker,
  SyntaxHighlightingWorker,
  TextMeasurementWorker,
} from '@lvce-editor/rpc-registry'
import { createClipBoardWorkerRpc } from '../CreateClipBoardWorkerRpc/CreateClipBoardWorkerRpc.ts'
import { createExtensionManagementWorkerRpc } from '../CreateExtensionManagementWorkerRpc/CreateExtensionManagementWorkerRpc.ts'
import { createFileSystemWorkerRpc } from '../CreateFileSystemWorkerRpc/CreateFileSystemWorkerRpc.ts'
import { createRendererWorkerRpc } from '../CreateRendererWorkerRpc/CreateRendererWorkerRpc.ts'
import { createSyntaxHighlightingWorkerRpc } from '../CreateSyntaxHighlightingWorkerRpc/CreateSyntaxHighlightingWorkerRpc.ts'
import { createTextMeasurementWorkerRpc } from '../CreateTextMeasurementWorkerRpc/CreateTextMeasurementWorkerRpc.ts'

export const initializeWorkerConnections = async (): Promise<void> => {
  const [fileSystemRpc, extensionManagementRpc, clipBoardRpc, syntaxHighlightingRpc, textMeasurementRpc] = await Promise.all([
    createFileSystemWorkerRpc(),
    createExtensionManagementWorkerRpc(),
    createClipBoardWorkerRpc(),
    createSyntaxHighlightingWorkerRpc(),
    createTextMeasurementWorkerRpc(),
  ])

  FileSystemWorker.set(fileSystemRpc)
  ExtensionManagementWorker.set(extensionManagementRpc)
  ClipBoardWorker.set(clipBoardRpc)
  SyntaxHighlightingWorker.set(syntaxHighlightingRpc)
  TextMeasurementWorker.set(textMeasurementRpc)
}

export const listen = async (): Promise<void> => {
  const rendererRpc = await createRendererWorkerRpc()
  RendererWorker.set(rendererRpc)
  await initializeWorkerConnections()
}
