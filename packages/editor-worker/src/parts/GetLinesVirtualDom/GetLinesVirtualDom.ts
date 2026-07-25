import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getLinesVirtualDom = (tokenizedLines: readonly (readonly string[])[]): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: tokenizedLines.length,
      className: ClassNames.EditorLines,
      type: VirtualDomElements.Div,
    },
  ]
  for (const tokenizedLine of tokenizedLines) {
    dom.push({
      childCount: tokenizedLine.length / 2,
      className: ClassNames.EditorLine,
      type: VirtualDomElements.Div,
    })
    for (let i = 0; i < tokenizedLine.length; i += 2) {
      dom.push(
        {
          childCount: 1,
          className: tokenizedLine[i + 1],
          type: VirtualDomElements.Span,
        },
        {
          text: tokenizedLine[i],
          type: VirtualDomElements.Text,
        },
      )
    }
  }
  return dom
}
