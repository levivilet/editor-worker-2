import type { AboutState } from '../AboutState/AboutState.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const renderFocusContext = (oldState: AboutState, newState: AboutState): readonly any[] => {
  return ['Viewlet.setFocusContext', newState.uid, WhenExpression.FocusAbout]
}
