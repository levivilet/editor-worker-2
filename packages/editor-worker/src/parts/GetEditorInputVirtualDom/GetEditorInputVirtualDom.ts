import { type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

const editorInputNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.EditorInput,
  type: VirtualDomElements.Div,
}

const textAreaNode: VirtualDomNode = {
  childCount: 0,
  onBeforeInput: DomEventListenerFunctions.HandleBeforeInput,
  type: VirtualDomElements.TextArea,
  value: '',
}

export const getEditorInputVirtualDom = (): readonly VirtualDomNode[] => {
  return [editorInputNode, textAreaNode]
}
