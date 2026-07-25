import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as RenderLine from '../RenderLine/RenderLine.ts'

export const getAboutContentVirtualDom = (lines: readonly string[]): readonly VirtualDomNode[] => {
  const dom = [
    {
      childCount: lines.length * 2 - 1,
      className: ClassNames.DialogMessage,
      type: VirtualDomElements.Div,
    },
    ...lines.flatMap(RenderLine.renderLine),
  ]
  return dom
}
