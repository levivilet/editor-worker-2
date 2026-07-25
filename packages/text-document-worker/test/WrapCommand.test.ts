import { expect, test } from '@jest/globals'
import type { AboutState } from '../src/parts/AboutState/AboutState.ts'
import * as AboutStates from '../src/parts/AboutStates/AboutStates.ts'
import { wrapCommand } from '../src/parts/AboutStates/AboutStates.ts'

const createState = (uid: number): AboutState => ({
  focusId: 0,
  lines: [],
  productName: 'test',
  uid,
})

const fn1 = async (state: AboutState): Promise<AboutState> => {
  return { ...state, productName: 'new' }
}

test('wrapCommand should update state when function returns new state', async () => {
  const uid = 123
  const oldState = createState(uid)
  const newState = { ...oldState, productName: 'new' }

  AboutStates.set(uid, oldState, oldState)

  const wrapped = wrapCommand(fn1)
  await wrapped(uid)

  const { newState: currentState } = AboutStates.get(uid)
  expect(currentState).toEqual(newState)
})

const fn2 = async (state: AboutState): Promise<AboutState> => state

test('wrapCommand should not update state when function returns same state', async () => {
  const uid = 123
  const state = createState(uid)

  AboutStates.set(uid, state, state)

  const wrapped = wrapCommand(fn2)
  await wrapped(uid)

  const { newState: currentState } = AboutStates.get(uid)
  expect(currentState).toEqual(state)
})
