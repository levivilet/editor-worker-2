import { expect, test } from '@jest/globals'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'

test('creates, isolates, and disposes editor states', () => {
  expect(EditorStates.create(1, 'file:///one.txt')).toEqual({ lines: [], uid: 1, uri: 'file:///one.txt' })
  expect(EditorStates.create(2, 'file:///two.txt')).toEqual({ lines: [], uid: 2, uri: 'file:///two.txt' })
  expect(EditorStates.get(1)).toEqual({ lines: [], uid: 1, uri: 'file:///one.txt' })
  expect(EditorStates.get(2)).toEqual({ lines: [], uid: 2, uri: 'file:///two.txt' })

  EditorStates.set({ lines: ['one'], uid: 1, uri: 'file:///one.txt' })
  expect(EditorStates.get(1)).toEqual({ lines: ['one'], uid: 1, uri: 'file:///one.txt' })
  expect(EditorStates.get(2)).toEqual({ lines: [], uid: 2, uri: 'file:///two.txt' })

  expect(EditorStates.getRendered(1)).toBeUndefined()
  EditorStates.setRendered(EditorStates.get(1))
  expect(EditorStates.getRendered(1)).toEqual({ lines: ['one'], uid: 1, uri: 'file:///one.txt' })

  EditorStates.dispose(1)

  expect(() => EditorStates.get(1)).toThrow(new Error('Editor state not found: 1'))
  expect(EditorStates.getRendered(1)).toBeUndefined()
  expect(EditorStates.get(2)).toEqual({ lines: [], uid: 2, uri: 'file:///two.txt' })
  EditorStates.dispose(2)
})
