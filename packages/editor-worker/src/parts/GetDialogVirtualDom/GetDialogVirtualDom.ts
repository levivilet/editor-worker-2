import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as GetPrimaryButtonVirtualDom from '../GetPrimaryButtonVirtualDom/GetPrimaryButtonVirtualDom.ts'
import * as GetButtonVirtualDom from '../GetSecondaryButtonVirtualDom/GetSecondaryButtonVirtualDom.ts'
import * as Ids from '../Ids/Ids.ts'
import * as InputName from '../InputName/InputName.ts'
import * as JoinBySpace from '../JoinBySpace/JoinBySpace.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as TabIndex from '../TabIndex/TabIndex.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const dialogToolBarRow: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.DialogToolBarRow,
  type: VirtualDomElements.Div,
}

const dialogMessageRow: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.DialogMessageRow,
  type: VirtualDomElements.Div,
}

const dialogContentRight: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.DialogContentRight,
  type: VirtualDomElements.Div,
}

const dialogHeading: VirtualDomNode = {
  childCount: 1,
  className: ClassNames.DialogHeading,
  id: Ids.DialogHeading,
  type: VirtualDomElements.Div,
}

const dialogButtonsRow: VirtualDomNode = {
  childCount: 2,
  className: ClassNames.DialogButtonsRow,
  type: VirtualDomElements.Div,
}

export const getDialogVirtualDom = (
  content: readonly VirtualDomNode[],
  closeMessage: string,
  infoMessage: string,
  okMessage: string,
  copyMessage: string,
  productName: string,
): readonly VirtualDomNode[] => {
  const dom = [
    {
      ariaLabelledBy: JoinBySpace.joinBySpace(Ids.DialogIcon, Ids.DialogHeading),
      ariaModal: AriaBoolean.True,
      childCount: 3,
      className: ClassNames.DialogContent,
      onFocusIn: DomEventListenerFunctions.HandleFocusIn,
      role: AriaRoles.Dialog,
      tabIndex: TabIndex.Focusable,
      type: VirtualDomElements.Div,
    },
    dialogToolBarRow,
    {
      ariaLabel: closeMessage,
      childCount: 1,
      className: ClassNames.DialogClose,
      onClick: DomEventListenerFunctions.HandleClickClose,
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.MaskIcon, ClassNames.MaskIconClose),
      type: VirtualDomElements.Div,
    },
    dialogMessageRow,
    {
      ariaLabel: infoMessage,
      childCount: 0,
      className: MergeClassNames.mergeClassNames(ClassNames.DialogIcon, ClassNames.DialogInfoIcon, ClassNames.MaskIcon, ClassNames.MaskIconInfo),
      id: Ids.DialogIcon,
      type: VirtualDomElements.Div,
    },
    dialogContentRight,
    dialogHeading,
    text(productName),
    ...content,
    dialogButtonsRow,
    ...GetButtonVirtualDom.getSecondaryButtonVirtualDom(okMessage, InputName.Ok),
    ...GetPrimaryButtonVirtualDom.getPrimaryButtonVirtualDom(copyMessage, InputName.Copy),
  ]
  return dom
}
