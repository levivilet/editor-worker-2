import { beforeAll, expect, test } from '@jest/globals'
import { FileSystemWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutFocusId from '../src/parts/AboutFocusId/AboutFocusId.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import * as LoadContent2 from '../src/parts/LoadContent2/LoadContent2.ts'

beforeAll(() => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: {
      userAgent: 'Test',
    },
  })
})

const registerConfigJsonPathMock = (): ReturnType<typeof RendererWorker.registerMockRpc> => {
  return RendererWorker.registerMockRpc({
    'PlatformPaths.getConfigJsonPath'(): string {
      return 'config.json'
    },
  })
}

const oldState: AboutState = {
  focusId: AboutFocusId.Ok,
  lines: ['old line'],
  productName: 'Old Name',
  uid: 1,
}

const runLoadContent = async (): Promise<AboutState> => {
  AboutStates.set(oldState.uid, oldState, oldState)
  const command = AboutStates.wrapAsyncCommand(LoadContent2.loadContent2)
  await command(oldState.uid)
  return AboutStates.get(oldState.uid).newState
}

test('loadContent2 loads metadata from config.json', async () => {
  using mockRendererRpc = registerConfigJsonPathMock()
  using mockFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(uri: string): string {
      expect(uri).toBe('config.json')
      return JSON.stringify({
        commit: 'abc123',
        date: 'config-date',
        productName: 'Configured Editor',
        version: '1.2.3',
      })
    },
  })

  const newState = await runLoadContent()

  expect(newState).toEqual({
    focusId: AboutFocusId.Ok,
    lines: ['Version: 1.2.3', 'Commit: abc123', 'Date: Invalid Date: config-date', 'Browser: Test'],
    productName: 'Configured Editor',
    uid: 1,
  })
  expect(mockRendererRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
  expect(mockFileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'config.json']])
})

test('loadContent2 does not fall back to hardcoded metadata', async () => {
  using mockRendererRpc = registerConfigJsonPathMock()
  using mockFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(): string {
      return JSON.stringify({})
    },
  })

  const newState = await runLoadContent()

  expect(newState).toEqual({
    focusId: AboutFocusId.Ok,
    lines: ['Version: ', 'Commit: ', 'Date: unknown', 'Browser: Test'],
    productName: '',
    uid: 1,
  })
  expect(mockRendererRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
  expect(mockFileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'config.json']])
})

test('loadContent2 rejects invalid config.json', async () => {
  using mockRendererRpc = registerConfigJsonPathMock()
  using mockFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile'(): string {
      return '{'
    },
  })

  AboutStates.set(oldState.uid, oldState, oldState)
  const command = AboutStates.wrapAsyncCommand(LoadContent2.loadContent2)
  await expect(command(oldState.uid)).rejects.toThrow(SyntaxError)
  expect(mockRendererRpc.invocations).toEqual([['PlatformPaths.getConfigJsonPath']])
  expect(mockFileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'config.json']])
})
