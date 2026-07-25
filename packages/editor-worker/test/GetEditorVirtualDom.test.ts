import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getEditorVirtualDom } from '../src/parts/GetEditorVirtualDom/GetEditorVirtualDom.ts'

test('renders the input and lines under one editor root', () => {
  const dom = getEditorVirtualDom({
    content: 'first line',
    diagnostics: [],
    languageId: 'plaintext',
    lines: ['first line'],
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [['first line', 'Token Text']],
    tokenizePath: '',
    uid: 1,
    uri: 'file:///test.txt',
  })

  expect(dom[0]).toEqual({
    childCount: 2,
    className: 'Editor',
    type: VirtualDomElements.Div,
  })
  expect(dom).toHaveLength(7)
})
