import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEditorInputVirtualDom } from '../src/parts/GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'

test('renders a hidden editor textarea with an input listener', () => {
  expect(getEditorInputVirtualDom('first line\nsecond line')).toEqual([
    {
      childCount: 1,
      className: 'EditorInput',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      onInput: DomEventListenerFunctions.HandleInput,
      type: VirtualDomElements.TextArea,
      value: 'first line\nsecond line',
    },
  ])
})
