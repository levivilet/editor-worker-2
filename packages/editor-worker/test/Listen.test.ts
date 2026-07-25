import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import {
  ClipBoardWorker,
  ExtensionManagementWorker,
  FileSystemWorker,
  get,
  RendererWorker,
  RpcId,
  SyntaxHighlightingWorker,
  TextMeasurementWorker,
} from '@lvce-editor/rpc-registry'
import * as Listen from '../src/parts/Listen/Listen.ts'

test('starts the editor worker rpc', async () => {
  const { dispose, start } = mockWorkerGlobalRpc()
  const listenPromise = Listen.listen()
  start()
  await expect(listenPromise).resolves.toBeUndefined()
  dispose()
})

test('initializes lazy worker connections', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToClipBoardWorker'() {},
    'SendMessagePortToExtensionHostWorker.sendMessagePortToExtensionManagementWorker'() {},
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'() {},
    'SendMessagePortToExtensionHostWorker.sendMessagePortToTextMeasurementWorker'() {},
    'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker'() {},
  })

  await Listen.initializeWorkerConnections()
  expect(mockRendererRpc.invocations).toEqual([])

  const clipBoardRpc = get(RpcId.ClipBoardWorker)
  const extensionManagementRpc = get(RpcId.ExtensionManagementWorker)
  const fileSystemRpc = get(RpcId.FileSystemWorker)
  const syntaxHighlightingRpc = get(RpcId.MarkdownWorker)
  const textMeasurementRpc = get(RpcId.IconThemeWorker)
  fileSystemRpc.send('test')
  extensionManagementRpc.send('test')
  clipBoardRpc.send('test')
  syntaxHighlightingRpc.send('test')
  textMeasurementRpc.send('test')
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
    [
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker',
      expect.anything(),
      'HandleMessagePort.handleMessagePort2',
    ],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToTextMeasurementWorker', expect.anything(), 'TextMeasurement.handleMessagePort', 0],
  ])

  await Promise.all([
    ClipBoardWorker.dispose(),
    ExtensionManagementWorker.dispose(),
    FileSystemWorker.dispose(),
    SyntaxHighlightingWorker.dispose(),
    TextMeasurementWorker.dispose(),
  ])
})
