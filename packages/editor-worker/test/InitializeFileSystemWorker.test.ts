import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as InitializeFileSystemWorker from '../src/parts/InitializeFileSystemWorker/InitializeFileSystemWorker.ts'

test('send - sends message port to file system worker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker'(): void {},
  })
  const port = {} as MessagePort
  await InitializeFileSystemWorker.send(port)
  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port, 'FileSystem.handleMessagePort', 0],
  ])
})
