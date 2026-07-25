import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

const editorLineNode: VirtualDomNode = {
  childCount: 1,
  className: 'EditorLine',
  type: VirtualDomElements.Div,
}

export const getLinesVirtualDom = (lines: readonly string[]): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    {
      childCount: lines.length,
      className: 'EditorLines',
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
