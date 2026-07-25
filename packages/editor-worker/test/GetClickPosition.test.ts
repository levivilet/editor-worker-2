import { expect, test } from '@jest/globals'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getClickPosition } from '../src/parts/GetClickPosition/GetClickPosition.ts'

const createState = (): EditorState => ({
  columnWidth: 9,
  content: 'first line\nsecond\n',
  diagnostics: [],
  height: 200,
  languageId: 'plaintext',
  lineNumbers: true,
  lines: ['first line', 'second', ''],
  longestLineWidth: 90,
  rowHeight: 20,
  scrollBarWidth: 0,
  selections: new Uint32Array([0, 0, 0, 0]),
  tokenizedLines: [],
  tokenizePath: '',
  uid: 1,
  uri: 'file:///test.txt',
  width: 300,
  x: 100,
  y: 50,
})

test('returns the closest cursor position for editor coordinates', () => {
  expect(getClickPosition(createState(), 145, 75)).toEqual({
    columnIndex: 5,
    rowIndex: 1,
  })
})

test('clamps clicks to the document boundaries', () => {
  const state = createState()
  expect(getClickPosition(state, 0, 0)).toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
  expect(getClickPosition(state, 1000, 1000)).toEqual({
    columnIndex: 0,
    rowIndex: 2,
  })
})

test('returns the document start before content is loaded', () => {
  expect(getClickPosition({ ...createState(), lines: [] }, 145, 75)).toEqual({
    columnIndex: 0,
    rowIndex: 0,
  })
})
