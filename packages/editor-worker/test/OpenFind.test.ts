import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { openFind } from '../src/parts/OpenFind/OpenFind.ts'

test('shows the find widget', () => {
  EditorStates.create(1)

  openFind(1)

  expect(EditorStates.get(1).findWidgetVisible).toBe(true)
  EditorStates.dispose(1)
})
