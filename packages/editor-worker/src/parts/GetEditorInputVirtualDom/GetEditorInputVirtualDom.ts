import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const editorInputNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorInput,
  type: VirtualDomElements.Div,
}

export const getEditorInputVirtualDom = (content: string): readonly VirtualDomNode[] => {
  return [
    editorInputNode,
    {
      childCount: 0,
      onInput: DomEventListenerFunctions.HandleInput,
      type: VirtualDomElements.TextArea,
      value: content,
    },
  ]
}
