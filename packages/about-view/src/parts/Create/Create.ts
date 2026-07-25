import type { AboutState } from '../AboutState/AboutState.ts'
import * as AboutStates from '../AboutStates/AboutStates.ts'

export const create = (uid: number): void => {
  const state: AboutState = {
    focusId: 0,
    lines: [],
    productName: '',
    uid,
  }
  AboutStates.set(uid, state, state)
}
