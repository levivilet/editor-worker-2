import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const lineNumberNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.LineNumber,
  type: VirtualDomElements.Span,
}

export const getLineNumbersVirtualDom = (lineCount: number): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: lineCount,
      className: ClassNames.Gutter,
      type: VirtualDomElements.Div,
    },
  ]
  for (let index = 0; index < lineCount; index++) {
    dom.push(lineNumberNode, {
      text: index + 1,
      type: VirtualDomElements.Text,
    })
  }
  return dom
}
