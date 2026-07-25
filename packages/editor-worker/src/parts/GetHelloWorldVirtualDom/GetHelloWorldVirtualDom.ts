import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

export const getHelloWorldVirtualDom = (): readonly VirtualDomNode[] => {
  return [
    {
      childCount: 1,
      type: VirtualDomElements.H1,
    },
    {
      text: 'Hello World',
      type: VirtualDomElements.Text,
    },
  ]
}
