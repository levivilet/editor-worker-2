import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getLinesVirtualDom } from '../src/parts/GetLinesVirtualDom/GetLinesVirtualDom.ts'

test('renders one virtual DOM element per line', () => {
  expect(getLinesVirtualDom(['first', '', 'third'])).toEqual([
    {
      childCount: 3,
      className: 'EditorLines',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'EditorLine',
      type: VirtualDomElements.Div,
    },
    {
      text: 'first',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'EditorLine',
      type: VirtualDomElements.Div,
    },
    {
      text: '',
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'EditorLine',
      type: VirtualDomElements.Div,
    },
    {
      text: 'third',
      type: VirtualDomElements.Text,
    },
  ])
})
