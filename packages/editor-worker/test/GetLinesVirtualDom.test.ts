import { expect, test } from '@jest/globals'
import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getLinesVirtualDom } from '../src/parts/GetLinesVirtualDom/GetLinesVirtualDom.ts'

test('renders one virtual DOM element per line', () => {
  expect(
    getLinesVirtualDom([
      ['const', 'Token Keyword', ' value = 1', 'Token Text'],
      ['', 'Token Text'],
    ]),
  ).toEqual([
    {
      childCount: 2,
      className: 'EditorLines',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'EditorLine',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames('Token', 'Keyword'),
      type: VirtualDomElements.Span,
    },
    {
      text: 'const',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: mergeClassNames('Token', 'Text'),
      type: VirtualDomElements.Span,
    },
    {
      text: ' value = 1',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'EditorLine',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: mergeClassNames('Token', 'Text'),
      type: VirtualDomElements.Span,
    },
    {
      text: '',
      type: VirtualDomElements.Text,
    },
  ])
})
