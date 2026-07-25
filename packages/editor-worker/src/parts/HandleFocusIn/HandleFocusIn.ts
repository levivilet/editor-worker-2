import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { AboutState } from '../AboutState/AboutState.ts'
import * as AboutFocusId from '../AboutFocusId/AboutFocusId.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const handleFocusIn = async (context: AsyncCommandContext<AboutState>): Promise<void> => {
  // TODO remove side effect
  await RendererWorker.setFocus(WhenExpression.FocusAbout)
  await context.updateState((state) => {
    const { focusId } = state
    if (focusId) {
      return state
    }
    return {
      ...state,
      focusId: AboutFocusId.Ok,
    }
  })
}
