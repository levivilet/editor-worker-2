import { expect, test } from '@jest/globals'
import { FileSystemWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadConfig from '../src/parts/LoadConfig/LoadConfig.ts'

const registerConfigJsonPathMock = (): ReturnType<typeof RendererWorker.registerMockRpc> => {
  return RendererWorker.registerMockRpc({
    'PlatformPaths.getConfigJsonPath'(): string {
      return 'config.json'
    },
  })
}

test('loadConfig', async () => {
  using mockRendererRpc = registerConfigJsonPathMock()
  using mockFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(uri: string): string {
      expect(uri).toBe('config.json')
      return JSON.stringify({
        commit: 'abc123',
        date: '2024-01-01T00:00:00.000Z',
        productName: 'Test Editor',
        version: '1.2.3',
      })
    },
  })
  const config = await LoadConfig.loadConfig()

  expect(config).toEqual({
    commit: 'abc123',
    date: '2024-01-01T00:00:00.000Z',
    productName: 'Test Editor',
    version: '1.2.3',
  })
  expect(mockRendererRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
  expect(mockFileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'config.json']])
})

test('loadConfig - missing values', async () => {
  using mockRendererRpc = registerConfigJsonPathMock()
  using mockFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(): string {
      return JSON.stringify({})
    },
  })

  const config = await LoadConfig.loadConfig()

  expect(config).toEqual({
    commit: '',
    date: '',
    productName: '',
    version: '',
  })
  expect(mockRendererRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
  expect(mockFileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'config.json']])
})
