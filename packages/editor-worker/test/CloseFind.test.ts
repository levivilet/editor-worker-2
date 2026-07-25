import { expect, test } from '@jest/globals'
import { closeFind } from '../src/parts/CloseFind/CloseFind.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('hides the find widget', () => {
  const state = EditorStates.create(1)
  EditorStates.set({
    ...state,
    findWidgetVisible: true,
  })

  closeFind(1)

  expect(EditorStates.get(1).findWidgetVisible).toBe(false)
  EditorStates.dispose(1)
})
