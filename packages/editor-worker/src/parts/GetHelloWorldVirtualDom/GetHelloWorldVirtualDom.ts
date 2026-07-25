import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'

const helloWorldVirtualDom: readonly VirtualDomNode[] = [
  {
    childCount: 1,
    type: VirtualDomElements.H1,
  },
  {
    text: 'Hello World',
    type: VirtualDomElements.Text,
  },
]

export const getHelloWorldVirtualDom = (): readonly VirtualDomNode[] => {
  return helloWorldVirtualDom
}
