import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getCursorVirtualDom } from '../src/parts/GetCursorVirtualDom/GetCursorVirtualDom.ts'

test('renders the cursor in its own div at the selected position', () => {
  const state: EditorState = {
    columnWidth: 9,
    content: 'first line\nsecond line',
    diagnostics: [],
    height: 200,
    languageId: 'plaintext',
    lineNumbers: true,
    lines: ['first line', 'second line'],
    longestLineWidth: 99,
    rowHeight: 20,
    scrollBarWidth: 0,
    selections: new Uint32Array([1, 5, 1, 5]),
    tokenizedLines: [],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///test.txt',
    width: 300,
    x: 100,
    y: 50,
  }

  expect(getCursorVirtualDom(state)).toEqual([
    {
      childCount: 0,
      className: 'EditorCursor',
      'data-columnIndex': '5',
      'data-rowIndex': '1',
      translate: '45px 20px',
      type: VirtualDomElements.Div,
    },
  ])
})
