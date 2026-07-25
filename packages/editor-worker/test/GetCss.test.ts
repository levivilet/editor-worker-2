import { expect, test } from '@jest/globals'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('renders dynamic cursor positions for each selection', () => {
  const state: EditorState = {
    canRedo: false,
    canUndo: false,
    columnWidth: 9,
    diagnostics: [],
    findWidgetVisible: false,
    height: 200,
    languageId: 'plaintext',
    lineCount: 2,
    lineNumbers: true,
    lines: ['first line', 'second line'],
    longestLineWidth: 99,
    maxLineY: 2,
    minLineY: 0,
    modified: false,
    rowHeight: 20,
    scrollBarWidth: 0,
    scrollLeft: 0,
    scrollTop: 0,
    selections: new Uint32Array([1, 5, 1, 5, 0, 2, 0, 3]),
    tokenizedLines: [],
    tokenizePath: '',
    uid: 0.5,
    uri: 'file:///test.txt',
    useCache: true,
    version: 0,
    width: 300,
    x: 100,
    y: 50,
  }

  expect(getCss(state)).toBe(`[class~="EditorCursor-0.5-0"] {
  translate: 45px 20px;
}
[class~="EditorCursor-0.5-1"] {
  translate: 27px 0px;
}
[class~="EditorSelection-0.5-1-0"] {
  height: 20px;
  translate: 18px 0px;
  width: 9px;
}`)
})
