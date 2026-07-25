import { beforeEach, expect, test } from '@jest/globals'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import * as Create from '../src/parts/Create/Create.ts'

beforeEach(() => {
  AboutStates.clear()
})

test('create initializes state with default values', () => {
  const uid = 123
  Create.create(uid)
  const result = AboutStates.get(uid)

  expect(result).toEqual({
    newState: {
      focusId: 0,
      lines: [],
      productName: '',
      uid: 123,
    },
    oldState: {
      focusId: 0,
      lines: [],
      productName: '',
      uid: 123,
    },
    scheduledState: {
      focusId: 0,
      lines: [],
      productName: '',
      uid: 123,
    },
  })
})
