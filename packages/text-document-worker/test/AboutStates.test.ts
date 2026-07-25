import { beforeEach, expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'

beforeEach(() => {
  AboutStates.clear()
})

test('set and get state', () => {
  const uid = 1
  const oldState: AboutState = {
    focusId: 0,
    lines: ['line 1', 'line 2'],
    productName: 'Test App',
    uid: 1,
  }
  const newState: AboutState = {
    focusId: 1,
    lines: ['line 1', 'line 2', 'line 3'],
    productName: 'Test App',
    uid: 1,
  }

  AboutStates.set(uid, oldState, newState)
  const result = AboutStates.get(uid)

  expect(result).toEqual({
    newState,
    oldState,
    scheduledState: newState,
  })
})

test('get non-existent state', () => {
  const result = AboutStates.get(123)
  expect(result).toBeUndefined()
})

test('getKeys returns all state keys', () => {
  const uid1 = 1
  const uid2 = 2
  const state: AboutState = {
    focusId: 0,
    lines: ['line 1'],
    productName: 'Test App',
    uid: 1,
  }

  AboutStates.set(uid1, state, state)
  AboutStates.set(uid2, state, state)

  const keys = AboutStates.getKeys()
  expect(keys).toEqual([uid1, uid2])
})
