import { expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getEditorInputVirtualDom } from '../src/parts/GetEditorInputVirtualDom/GetEditorInputVirtualDom.ts'

test('renders a hidden editor textarea with a beforeinput listener and no document copy', () => {
  expect(getEditorInputVirtualDom()).toEqual([
    {
      childCount: 1,
      className: 'EditorInput',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      onBeforeInput: DomEventListenerFunctions.HandleBeforeInput,
      type: VirtualDomElements.TextArea,
      value: '',
    },
  ])
})
