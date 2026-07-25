import type { AboutState } from '../AboutState/AboutState.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const diffType = DiffType.RenderAbout

export const isEqual = (oldState: AboutState, newState: AboutState): boolean => {
  return oldState.productName === newState.productName && JSON.stringify(oldState.lines) === JSON.stringify(newState.lines)
}
