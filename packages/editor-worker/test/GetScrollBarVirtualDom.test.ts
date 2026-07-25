import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getScrollBarVirtualDom } from '../src/parts/GetScrollBarVirtualDom/GetScrollBarVirtualDom.ts'
import * as MergeClassNames from '../src/parts/MergeClassNames/MergeClassNames.ts'

test('does not render a horizontal scrollbar when content fits', () => {
  expect(getScrollBarVirtualDom(0)).toEqual([])
})

test('renders a horizontal scrollbar when content overflows', () => {
  expect(getScrollBarVirtualDom(50)).toEqual([
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.ScrollBar, ClassNames.ScrollBarHorizontal),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.ScrollBarThumb, ClassNames.ScrollBarThumbHorizontal),
      type: VirtualDomElements.Div,
      width: 50,
    },
  ])
})
