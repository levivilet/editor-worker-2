import * as AboutStates from '../AboutStates/AboutStates.ts'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'

export const doRender = (uid: number, diffResult: readonly number[]): readonly any[] => {
  const { oldState, scheduledState } = AboutStates.get(uid)
  AboutStates.set(uid, scheduledState, scheduledState)
  const commands = ApplyRender.applyRender(oldState, scheduledState, diffResult)
  return commands
}
