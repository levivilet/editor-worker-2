import { expect, test } from '@jest/globals'
import { AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEditorVirtualDom } from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'

const createState = (lineNumbers: boolean): EditorState => {
  return {
    canRedo: false,
    canUndo: false,
    columnWidth: 9,
    diagnostics: [],
    findWidgetVisible: false,
    height: 200,
    languageId: 'plaintext',
    lineCount: 2,
    lineNumbers,
    lines: ['first', 'second'],
    longestLineWidth: 90,
    maxLineY: 2,
    minLineY: 0,
    modified: false,
    rowHeight: 20,
    scrollBarWidth: 0,
    scrollLeft: 0,
    scrollTop: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [
      ['first', 'Token Text'],
      ['second', 'Token Text'],
    ],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///test.txt',
    useCache: true,
    version: 0,
    width: 100,
    x: 0,
    y: 0,
  }
}

test('renders line numbers, lines, and cursor inside the clickable editor content', () => {
  const dom = getEditorVirtualDom(createState(true))

  expect(dom[0]).toEqual({
    childCount: 2,
    className: 'Editor',
    type: VirtualDomElements.Div,
  })
  expect(dom[1]).toMatchObject({
    className: 'EditorInput',
  })
  expect(dom[2]).toMatchObject({
    value: '',
  })
  expect(dom[3]).toEqual({
    childCount: 3,
    className: 'EditorContent',
    onClick: DomEventListenerFunctions.HandleClick,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    onPointerMove: DomEventListenerFunctions.HandlePointerMove,
    onPointerUp: DomEventListenerFunctions.HandlePointerUp,
    onWheel: DomEventListenerFunctions.HandleWheel,
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  })
  expect(dom[4]).toEqual({
    childCount: 2,
    className: 'Gutter',
    type: VirtualDomElements.Div,
  })
  expect(dom[9]).toEqual({
    childCount: 2,
    className: 'EditorLines',
    type: VirtualDomElements.Div,
  })
  expect(dom.at(-1)).toEqual({
    childCount: 0,
    className: mergeClassNames('EditorCursor', 'EditorCursor-1-0'),
    'data-columnIndex': '0',
    'data-rowIndex': '0',
    type: VirtualDomElements.Div,
  })
})

test('does not render a gutter when line numbers are disabled', () => {
  const dom = getEditorVirtualDom(createState(false))

  expect(dom[0]).toEqual({
    childCount: 2,
    className: 'Editor',
    type: VirtualDomElements.Div,
  })
  expect(dom[3]).toEqual({
    childCount: 2,
    className: 'EditorContent',
    onClick: DomEventListenerFunctions.HandleClick,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    onPointerMove: DomEventListenerFunctions.HandlePointerMove,
    onPointerUp: DomEventListenerFunctions.HandlePointerUp,
    onWheel: DomEventListenerFunctions.HandleWheel,
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  })
  expect(dom[4]).toEqual({
    childCount: 2,
    className: 'EditorLines',
    type: VirtualDomElements.Div,
  })
  expect(dom.some((node) => node.className === 'Gutter')).toBe(false)
})

test('renders every selection as a separate cursor child', () => {
  const state = {
    ...createState(false),
    selections: new Uint32Array([0, 1, 0, 1, 1, 2, 1, 2]),
  }

  const dom = getEditorVirtualDom(state)

  expect(dom[3].childCount).toBe(3)
  expect(dom.slice(-2)).toEqual([
    {
      childCount: 0,
      className: mergeClassNames('EditorCursor', 'EditorCursor-1-0'),
      'data-columnIndex': '1',
      'data-rowIndex': '0',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames('EditorCursor', 'EditorCursor-1-1'),
      'data-columnIndex': '2',
      'data-rowIndex': '1',
      type: VirtualDomElements.Div,
    },
  ])
})
