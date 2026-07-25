import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { getLineNumbersVirtualDom } from '../src/parts/GetLineNumbersVirtualDom/GetLineNumbersVirtualDom.ts'

test('renders sequential line numbers in a gutter', () => {
  expect(getLineNumbersVirtualDom(2)).toEqual([
    {
      childCount: 2,
      className: 'Gutter',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    {
      text: 1,
      type: VirtualDomElements.Text,
    },
    {
      childCount: 1,
      className: 'LineNumber',
      type: VirtualDomElements.Span,
    },
    {
      text: 2,
      type: VirtualDomElements.Text,
    },
  ])
})
