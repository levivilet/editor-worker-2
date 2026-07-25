import { expect, test } from '@jest/globals'
import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'

test('loads file content into editor lines', async () => {
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (uri: string): Promise<string> => {
      expect(uri).toBe('file:///test.txt')
      return 'first\r\nsecond\nthird'
    },
  })
  create(1, 'file:///test.txt')

  await loadContent(1)

  expect(EditorStates.get(1)).toEqual({
    diagnostics: [],
    lines: ['first', 'second', 'third'],
    uid: 1,
    uri: 'file:///test.txt',
  })
  expect(fileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'file:///test.txt']])
  dispose(1)
})
