import { expect, test } from '@jest/globals'
import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getSelectionVirtualDom } from '../src/parts/GetSelectionVirtualDom/GetSelectionVirtualDom.ts'

test('renders one selection rectangle per visible selected row', () => {
  const state = create(80)
  EditorStates.set({
    ...state,
    lines: ['one', 'two', 'three'],
    maxLineY: 3,
    selections: new Uint32Array([0, 1, 2, 2]),
  })

  expect(getSelectionVirtualDom(EditorStates.get(80))).toEqual([
    {
      childCount: 0,
      className: mergeClassNames('EditorSelection', 'EditorSelection-80-0-0'),
      'data-rowIndex': '0',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames('EditorSelection', 'EditorSelection-80-0-1'),
      'data-rowIndex': '1',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames('EditorSelection', 'EditorSelection-80-0-2'),
      'data-rowIndex': '2',
      type: VirtualDomElements.Div,
    },
  ])
  dispose(80)
})

test('omits collapsed and offscreen selections', () => {
  const state = create(81)
  expect(getSelectionVirtualDom(state)).toEqual([])
  EditorStates.set({
    ...state,
    maxLineY: 12,
    minLineY: 10,
    selections: new Uint32Array([0, 0, 2, 2]),
  })
  expect(getSelectionVirtualDom(EditorStates.get(81))).toEqual([])
  dispose(81)
})
