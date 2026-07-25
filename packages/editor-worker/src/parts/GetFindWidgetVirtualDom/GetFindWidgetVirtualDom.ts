import { AriaRoles, mergeClassNames, type VirtualDomNode, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import type { EditorState } from '../EditorState/EditorState.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const findWidgetWidth = 300
const findWidgetHeight = 30
const findWidgetPaddingRight = 20
const findWidgetPaddingTop = 10

const findWidgetRightNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.FindWidgetRight,
  type: VirtualDomElements.Div,
}

const findWidgetFindNode: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.FindWidgetFind,
  type: VirtualDomElements.Div,
}

const searchFieldNode: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.SearchField,
  role: AriaRoles.None,
  type: VirtualDomElements.Div,
}

const inputNode: VirtualDomNode = {
  autocapitalize: 'off',
  autocorrect: 'off',
  autofocus: true,
  childCount: 0,
  className: ClassNames.MultilineInputBox,
  name: 'SearchValue',
  placeholder: 'Find',
  spellcheck: false,
  type: VirtualDomElements.TextArea,
}

const searchFieldButtonsNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.SearchFieldButtons,
  type: VirtualDomElements.Div,
}

export const getFindWidgetVirtualDom = (state: EditorState): readonly VirtualDomNode[] => {
  const { findWidgetVisible, width } = state
  if (!findWidgetVisible) {
    return []
  }
  const x = Math.max(width - findWidgetWidth - findWidgetPaddingRight, 0)
  return [
    {
      childCount: 1,
      className: mergeClassNames(ClassNames.Viewlet, ClassNames.ViewletFind, ClassNames.ViewletFindWidget, ClassNames.FindWidget),
      height: findWidgetHeight,
      role: AriaRoles.Group,
      translate: `${x}px ${findWidgetPaddingTop}px`,
      type: VirtualDomElements.Div,
      width: findWidgetWidth,
    },
    findWidgetRightNode,
    findWidgetFindNode,
    searchFieldNode,
    inputNode,
    searchFieldButtonsNode,
  ]
}
