import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import * as FindWidgetLifecycleReducer from '../src/parts/FindWidgetLifecycleReducer/FindWidgetLifecycleReducer.ts'

test('late settle events leave a replacement instance unchanged', () => {
  const state = EditorStates.create(81)
  const first = FindWidgetLifecycleReducer.requestOpen(state)
  const closed = FindWidgetLifecycleReducer.requestClose(first.state)
  const replacement = FindWidgetLifecycleReducer.requestOpen(closed.state)

  expect(FindWidgetLifecycleReducer.markVisible(replacement.state, first.handle.instanceId)).toBe(replacement.state)
  expect(FindWidgetLifecycleReducer.markFailed(replacement.state, first.handle.instanceId)).toBe(replacement.state)
  EditorStates.dispose(81)
})
