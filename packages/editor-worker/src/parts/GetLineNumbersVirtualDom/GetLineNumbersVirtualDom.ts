import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const lineNumberNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.LineNumber,
  type: VirtualDomElements.Span,
}

const getLineNumberVirtualDom = (_line: string, index: number, minLineY: number): readonly VirtualDomNode[] => {
  return [
    lineNumberNode,
    {
      text: minLineY + index + 1,
      type: VirtualDomElements.Text,
    },
  ]
}

export const getLineNumbersVirtualDom = (lines: readonly string[], minLineY = 0): readonly VirtualDomNode[] => {
  return [
    {
      childCount: lines.length,
      className: ClassNames.Gutter,
      type: VirtualDomElements.Div,
    },
    ...lines.flatMap((line, index) => getLineNumberVirtualDom(line, index, minLineY)),
  ]
}
