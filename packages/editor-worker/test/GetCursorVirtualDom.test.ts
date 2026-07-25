import { expect, test } from '@jest/globals'
import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getCursorVirtualDom } from '../src/parts/GetCursorVirtualDom/GetCursorVirtualDom.ts'

test('renders each cursor with its own class and without inline styles', () => {
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
    uid: 1,
    uri: 'file:///test.txt',
    useCache: true,
    version: 0,
    width: 300,
    x: 100,
    y: 50,
  }

  expect(getCursorVirtualDom(state)).toEqual([
    {
      childCount: 0,
      className: mergeClassNames('EditorCursor', 'EditorCursor-1-0'),
      'data-columnIndex': '5',
      'data-rowIndex': '1',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames('EditorCursor', 'EditorCursor-1-1'),
      'data-columnIndex': '3',
      'data-rowIndex': '0',
      type: VirtualDomElements.Div,
    },
  ])
})
