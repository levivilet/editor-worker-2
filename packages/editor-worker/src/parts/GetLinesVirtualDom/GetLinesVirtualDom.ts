import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const editorLineNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorLine,
  type: VirtualDomElements.Div,
}

export const getLinesVirtualDom = (lines: readonly string[]): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: lines.length,
      className: ClassNames.EditorLines,
      type: VirtualDomElements.Div,
    },
  ]
  for (const line of lines) {
    dom.push(editorLineNode, {
      text: line,
      type: VirtualDomElements.Text,
    })
  }
  return dom
}
