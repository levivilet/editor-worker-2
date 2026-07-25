import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const getTokenVirtualDom = (tokenText: string, index: number, tokenizedLine: readonly string[]): readonly VirtualDomNode[] => {
  if (index % 2 !== 0) {
    return []
  }
  return [
    {
      childCount: 1,
      className: tokenizedLine[index + 1],
      type: VirtualDomElements.Span,
    },
    {
      text: tokenText,
      type: VirtualDomElements.Text,
    },
  ]
}

const getLineVirtualDom = (tokenizedLine: readonly string[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: tokenizedLine.length / 2,
      className: ClassNames.EditorLine,
      type: VirtualDomElements.Div,
    },
    ...tokenizedLine.flatMap(getTokenVirtualDom),
  ]
}

export const getLinesVirtualDom = (tokenizedLines: readonly (readonly string[])[]): readonly VirtualDomNode[] => {
  return [
    {
      childCount: tokenizedLines.length,
      className: ClassNames.EditorLines,
      type: VirtualDomElements.Div,
    },
    ...tokenizedLines.flatMap(getLineVirtualDom),
  ]
}
