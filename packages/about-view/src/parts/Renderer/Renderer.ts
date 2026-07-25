import type { AboutState } from '../AboutState/AboutState.ts'

export interface Renderer {
  (oldState: AboutState, newState: AboutState): readonly any[]
}
