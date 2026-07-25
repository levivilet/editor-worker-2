import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import { ClipBoardWorker, ExtensionManagementWorker, FileSystemWorker, get, RendererWorker, RpcId } from '@lvce-editor/rpc-registry'
import * as Listen from '../src/parts/Listen/Listen.ts'

test('starts the editor worker rpc', async () => {
  const { dispose, start } = mockWorkerGlobalRpc()
  const listenPromise = Listen.listen()
  start()
  await expect(listenPromise).resolves.toBeUndefined()
  dispose()
})

test('initializes lazy connections to the file system, extension management, and clipboard workers', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToClipBoardWorker'() {},
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionManagementWorker'() {},
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {},
  })

  await Listen.initializeWorkerConnections()
  expect(mockRendererRpc.invocations).toEqual([])

  const clipBoardRpc = get(RpcId.ClipBoardWorker)
  const extensionManagementRpc = get(RpcId.ExtensionManagementWorker)
  const fileSystemRpc = get(RpcId.FileSystemWorker)
  fileSystemRpc.send('test')
  extensionManagementRpc.send('test')
  clipBoardRpc.send('test')
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(mockRendererRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', expect.anything(), 'FileSystem.handleMessagePort', RpcId.EditorWorker],
    [
      'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionManagementWorker',
      expect.anything(),
      'Extensions.handleMessagePort',
      RpcId.EditorWorker,
    ],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToClipBoardWorker', expect.anything(), 'ClipBoard.handleMessagePort', RpcId.EditorWorker],
  ])

  await Promise.all([ClipBoardWorker.dispose(), ExtensionManagementWorker.dispose(), FileSystemWorker.dispose()])
})
