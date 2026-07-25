import { expect, test } from '@jest/globals'
import { SyntaxHighlightingWorker } from '@lvce-editor/rpc-registry'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { handleInput } from '../src/parts/HandleInput/HandleInput.ts'

test('updates the editor content and lines', async () => {
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
    content: 'first\r\nsecond\nthird',
    diagnostics: [],
    height: 0,
    languageId: 'plaintext',
    lineNumbers: true,
    lines: ['first', 'second', 'third'],
    longestLineWidth: 54,
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
  dispose(1)
  await SyntaxHighlightingWorker.dispose()
})
