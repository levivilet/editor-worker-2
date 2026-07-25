import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const lineNumberNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.LineNumber,
  type: VirtualDomElements.Span,
}

const getLineNumberVirtualDom = (_line: string, index: number): readonly VirtualDomNode[] => {
  return [
    lineNumberNode,
    {
      text: index + 1,
      type: VirtualDomElements.Text,
    },
  ]
}

export const getLineNumbersVirtualDom = (lines: readonly string[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: lines.length,
      className: ClassNames.Gutter,
      type: VirtualDomElements.Div,
    },
    ...lines.flatMap(getLineNumberVirtualDom),
  ]
}
