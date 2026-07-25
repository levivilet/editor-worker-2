import { expect, test } from '@jest/globals'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('renders dynamic cursor positions for each selection', () => {
  const state: EditorState = {
    columnWidth: 9,
    diagnostics: [],
    height: 200,
    languageId: 'plaintext',
    lineCount: 2,
    lineNumbers: true,
    lines: ['first line', 'second line'],
    longestLineWidth: 99,
    maxLineY: 2,
    minLineY: 0,
    rowHeight: 20,
    scrollBarWidth: 0,
    selections: new Uint32Array([1, 5, 1, 5, 0, 2, 0, 3]),
    tokenizedLines: [],
    tokenizePath: '',
    uid: 42,
    uri: 'file:///test.txt',
    width: 300,
    x: 100,
    y: 50,
  }

  expect(getCss(state)).toBe(`.EditorCursor-42-0 {
  translate: 45px 20px;
}
.EditorCursor-42-1 {
  translate: 27px 0px;
}`)
})
