import { expect, test } from '@jest/globals'
import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { handleInput } from '../src/parts/HandleInput/HandleInput.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'
import { registerMockTextDocumentWorker } from './MockTextDocumentWorker.ts'

test('updates the text document and visible editor lines', async () => {
  const textDocumentRpc = registerMockTextDocumentWorker()
  SyntaxHighlightingWorker.set({
    dispose: async (): Promise<void> => {},
    invoke: async (): Promise<unknown> => [
      ['first', 'Token Keyword'],
      ['second', 'Token String'],
      ['third', 'Token Comment'],
    ],
  } as any)
  create(1, 'file:///test.txt', 0, 0, 100)

  await handleInput(1, 'first\r\nsecond\nthird')

  expect(EditorStates.get(1)).toEqual({
    columnWidth: 9,
    diagnostics: [],
    height: 0,
    languageId: 'plaintext',
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
    tokenizePath: '',
    uid: 1,
    uri: 'file:///test.txt',
    width: 100,
    x: 0,
    y: 0,
  })
  expect(textDocumentRpc.invocations).toEqual([
    ['TextDocument.setContent', 1, 'first\r\nsecond\nthird'],
    ['TextDocument.getLines', 1, 0, 3],
  ])
  dispose(1)
  TextDocumentWorker.reset()
  await SyntaxHighlightingWorker.dispose()
})
