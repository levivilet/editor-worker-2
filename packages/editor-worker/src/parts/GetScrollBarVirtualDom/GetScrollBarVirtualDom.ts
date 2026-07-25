import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getScrollBarVirtualDom = (scrollBarWidth: number): readonly VirtualDomNode[] => {
  if (scrollBarWidth === 0) {
    return []
  }
  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.ScrollBar, ClassNames.ScrollBarHorizontal),
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.ScrollBarThumb, ClassNames.ScrollBarThumbHorizontal),
      type: VirtualDomElements.Div,
      width: scrollBarWidth,
    },
  ]
}
