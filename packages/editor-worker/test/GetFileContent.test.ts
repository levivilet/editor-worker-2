import { beforeEach, expect, jest, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'

const cacheGet = jest.fn<(uri: string, hash: string) => Promise<string | undefined>>()
const cacheSet = jest.fn<(uri: string, hash: string, content: string) => Promise<void>>()

jest.unstable_mockModule('../src/parts/TextDocumentCache/TextDocumentCache.ts', () => ({
  get: cacheGet,
  set: cacheSet,
}))

const GetFileContent = await import('../src/parts/GetFileContent/GetFileContent.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('reads content directly when caching is disabled', async () => {
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (): Promise<string> => 'file content',
  })

  await expect(GetFileContent.getFileContent('file:///test.txt', false)).resolves.toBe('file content')
  expect(fileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'file:///test.txt']])
  expect(cacheGet).not.toHaveBeenCalled()
  expect(cacheSet).not.toHaveBeenCalled()
})

test('returns cached content when the file hash matches', async () => {
  cacheGet.mockResolvedValue('cached content')
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.getFileHash': async (): Promise<string> => 'hash-1',
  })

  await expect(GetFileContent.getFileContent('file:///test.txt', true)).resolves.toBe('cached content')
  expect(fileSystemRpc.invocations).toEqual([['FileSystem.getFileHash', 'file:///test.txt']])
  expect(cacheGet).toHaveBeenCalledWith('file:///test.txt', 'hash-1')
  expect(cacheSet).not.toHaveBeenCalled()
})

test('reads and caches content on a cache miss', async () => {
  cacheGet.mockResolvedValue(undefined)
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.getFileHash': async (): Promise<string> => 'hash-1',
    'FileSystem.readFile': async (): Promise<string> => 'file content',
  })

  await expect(GetFileContent.getFileContent('file:///test.txt', true)).resolves.toBe('file content')
  expect(fileSystemRpc.invocations).toEqual([
    ['FileSystem.getFileHash', 'file:///test.txt'],
    ['FileSystem.readFile', 'file:///test.txt'],
  ])
  expect(cacheSet).toHaveBeenCalledWith('file:///test.txt', 'hash-1', 'file content')
})

test('falls back to reading when hashing is unavailable', async () => {
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.getFileHash': async (): Promise<string> => {
      throw new Error('not supported')
    },
    'FileSystem.readFile': async (): Promise<string> => 'file content',
  })

  await expect(GetFileContent.getFileContent('file:///test.txt', true)).resolves.toBe('file content')
  expect(fileSystemRpc.invocations).toEqual([
    ['FileSystem.getFileHash', 'file:///test.txt'],
    ['FileSystem.readFile', 'file:///test.txt'],
  ])
  expect(cacheGet).not.toHaveBeenCalled()
})

test('ignores Cache Storage read and write errors', async () => {
  cacheGet.mockRejectedValue(new Error('cache read failed'))
  cacheSet.mockRejectedValue(new Error('cache write failed'))
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.getFileHash': async (): Promise<string> => 'hash-1',
    'FileSystem.readFile': async (): Promise<string> => 'file content',
  })

  await expect(GetFileContent.getFileContent('file:///test.txt', true)).resolves.toBe('file content')
  expect(fileSystemRpc.invocations).toEqual([
    ['FileSystem.getFileHash', 'file:///test.txt'],
    ['FileSystem.readFile', 'file:///test.txt'],
  ])
  expect(cacheSet).toHaveBeenCalledWith('file:///test.txt', 'hash-1', 'file content')
})
