import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetAboutContentVirtualDom from '../GetAboutContentVirtualDom/GetAboutContentVirtualDom.ts'
import * as GetDialogVirtualDom from '../GetDialogVirtualDom/GetDialogVirtualDom.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getAboutVirtualDom = (
  productName: string,
  lines: readonly string[],
  closeMessage: string,
  okMessage: string,
  copyMessage: string,
  infoMessage: string,
): readonly VirtualDomNode[] => {
  const content = GetAboutContentVirtualDom.getAboutContentVirtualDom(lines)
  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.About),
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      type: VirtualDomElements.Div,
    },
    ...GetDialogVirtualDom.getDialogVirtualDom(content, closeMessage, infoMessage, okMessage, copyMessage, productName),
  ]
}
