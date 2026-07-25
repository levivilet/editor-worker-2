import { expect, test } from '@jest/globals'
import { FileSystemWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'

test('loads file content into editor lines', async () => {
  using fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.readFile': async (uri: string): Promise<string> => {
      expect(uri).toBe('file:///test.ts')
      return 'first\r\nsecond\nthird'
    },
  })
  const syntaxHighlightingRpc = {
    dispose: async (): Promise<void> => {},
    invocations: [] as unknown[][],
    invoke: async (method: string, ...params: readonly unknown[]): Promise<unknown> => {
      syntaxHighlightingRpc.invocations.push([method, ...params])
      return [
        ['first', 'Token Keyword'],
        ['second', 'Token String'],
        ['third', 'Token Comment'],
      ]
    },
  }
  SyntaxHighlightingWorker.set(syntaxHighlightingRpc as any)
  create(1, 'file:///test.ts', 0, 0, 100, 0, 0, '', 'typescript', '/tokenize-typescript.js')

  await loadContent(1)

  expect(EditorStates.get(1)).toEqual({
    columnWidth: 9,
    content: 'first\r\nsecond\nthird',
    diagnostics: [],
    languageId: 'typescript',
    lines: ['first', 'second', 'third'],
    longestLineWidth: 54,
    scrollBarWidth: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [
      ['first', 'Token Keyword'],
      ['second', 'Token String'],
      ['third', 'Token Comment'],
    ],
    tokenizePath: '/tokenize-typescript.js',
    uid: 1,
    uri: 'file:///test.ts',
    width: 100,
  })
  expect(fileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'file:///test.ts']])
  expect(syntaxHighlightingRpc.invocations).toEqual([
    ['Tokenizer.tokenizeCodeBlock', 'first\r\nsecond\nthird', 'typescript', '/tokenize-typescript.js'],
  ])
  dispose(1)
  await SyntaxHighlightingWorker.dispose()
})
