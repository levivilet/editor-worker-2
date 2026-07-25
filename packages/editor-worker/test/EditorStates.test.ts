import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('creates, isolates, and disposes editor states', () => {
  expect(EditorStates.create(1)).toEqual({ uid: 1 })
  expect(EditorStates.create(2)).toEqual({ uid: 2 })
  expect(EditorStates.get(1)).toEqual({ uid: 1 })
  expect(EditorStates.get(2)).toEqual({ uid: 2 })

  EditorStates.dispose(1)

  expect(() => EditorStates.get(1)).toThrow(new Error('Editor state not found: 1'))
  expect(EditorStates.get(2)).toEqual({ uid: 2 })
  EditorStates.dispose(2)
})
