import type { AboutState } from '../AboutState/AboutState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderFocusContext

export const isEqual = (oldState: AboutState, newState: AboutState): boolean => {
  return oldState.focusId === newState.focusId
}
