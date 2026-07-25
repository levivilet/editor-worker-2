import { beforeEach, expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import * as Dispose from '../src/parts/Dispose/Dispose.ts'

beforeEach(() => {
  AboutStates.clear()
})

test('dispose', () => {
  const uid = 1
  const state: AboutState = {
    focusId: 0,
    lines: ['test'],
    productName: 'Test',
    uid: 1,
  }
  AboutStates.set(uid, state, state)
  expect(AboutStates.get(uid)).toBeDefined()

  Dispose.dispose(uid)
  expect(AboutStates.get(uid)).toBeUndefined()
})
