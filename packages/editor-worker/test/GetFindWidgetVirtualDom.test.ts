import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getFindWidgetVirtualDom } from '../src/parts/GetFindWidgetVirtualDom/GetFindWidgetVirtualDom.ts'

test('find widget dom is rendered in its own functional root', () => {
  const state = {
    ...EditorStates.create(1),
    findWidgetVisible: true,
  }

  expect(getFindWidgetVirtualDom(state)).toEqual([])
  EditorStates.dispose(1)
})
