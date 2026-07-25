import { expect, test } from '@jest/globals'
import { FileSystemWorker, SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'
import { registerMockTextDocumentWorker } from './MockTextDocumentWorker.ts'

test('loads file content into editor lines', async () => {
  const textDocumentRpc = registerMockTextDocumentWorker()
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
    diagnostics: [],
    height: 0,
    languageId: 'typescript',
    lineCount: 3,
    lineNumbers: true,
    lines: ['first', 'second', 'third'],
    longestLineWidth: 54,
    maxLineY: 3,
    minLineY: 0,
    rowHeight: 20,
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
    x: 0,
    y: 0,
  })
  expect(fileSystemRpc.invocations).toEqual([['FileSystem.readFile', 'file:///test.ts']])
  expect(textDocumentRpc.invocations).toEqual([
    ['TextDocument.setContent', 1, 'first\r\nsecond\nthird'],
    ['TextDocument.getLines', 1, 0, 3],
  ])
  expect(syntaxHighlightingRpc.invocations).toEqual([
    ['Tokenizer.tokenizeCodeBlock', 'first\nsecond\nthird', 'typescript', '/tokenize-typescript.js'],
  ])
  dispose(1)
  TextDocumentWorker.reset()
  await SyntaxHighlightingWorker.dispose()
})
