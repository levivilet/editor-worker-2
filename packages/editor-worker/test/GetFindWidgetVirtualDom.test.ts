import { expect, test } from '@jest/globals'
import { AriaRoles, mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getFindWidgetVirtualDom } from '../src/parts/GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'

test('returns no dom when the find widget is closed', () => {
  const state = EditorStates.create(1)

  expect(getFindWidgetVirtualDom(state)).toEqual([])
  EditorStates.dispose(1)
})

test('returns the basic find widget dom when it is open', () => {
  const state = {
    ...EditorStates.create(1, '', 'plaintext', '', 0, 0, 600),
    findWidgetVisible: true,
  }

  expect(getFindWidgetVirtualDom(state)).toEqual([
    {
      childCount: 1,
      className: mergeClassNames('Viewlet', 'ViewletFind', 'ViewletFindWidget', 'FindWidget'),
      height: 30,
      role: AriaRoles.Group,
      translate: '280px 10px',
      type: VirtualDomElements.Div,
      width: 300,
    },
    {
      childCount: 1,
      className: 'FindWidgetRight',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: 'FindWidgetFind',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 2,
      className: 'SearchField',
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
    {
      autocapitalize: 'off',
      autocorrect: 'off',
      autofocus: true,
      childCount: 0,
      className: 'MultilineInputBox',
      name: 'SearchValue',
      placeholder: 'Find',
      spellcheck: false,
      type: VirtualDomElements.TextArea,
    },
    {
      childCount: 0,
      className: 'SearchFieldButtons',
      type: VirtualDomElements.Div,
    },
  ])
  EditorStates.dispose(1)
})
