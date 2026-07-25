import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../src/parts/EditorState/EditorState.ts'
import { getEditorVirtualDom } from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'

const createState = (lineNumbers: boolean): EditorState => {
  return {
    columnWidth: 9,
    content: 'first\nsecond',
    diagnostics: [],
    languageId: 'plaintext',
    lineNumbers,
    lines: ['first', 'second'],
    longestLineWidth: 90,
    scrollBarWidth: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [
      ['first', 'Token Text'],
      ['second', 'Token Text'],
    ],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///test.txt',
    width: 100,
  }
}

test('renders line numbers in a separate gutter from editor lines', () => {
  const dom = getEditorVirtualDom(createState(true))

  expect(dom[0]).toEqual({
    childCount: 3,
    className: 'Editor',
    type: VirtualDomElements.Div,
  })
  expect(dom[1]).toMatchObject({
    className: 'EditorInput',
  })
  expect(dom[3]).toEqual({
    childCount: 2,
    className: 'Gutter',
    type: VirtualDomElements.Div,
  })
  expect(dom[8]).toEqual({
    childCount: 2,
    className: 'EditorLines',
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
    className: 'EditorLines',
    type: VirtualDomElements.Div,
  })
  expect(dom.some((node) => node.className === 'Gutter')).toBe(false)
})
