import type { CloseFindOutcome } from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'
import * as FindWidgetLifecycle from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'

export const closeFind = (uid: number): Promise<CloseFindOutcome> => {
  return FindWidgetLifecycle.close(uid)
}

export const requestFindWidgetClose = (context: { readonly editorUid: number; readonly instanceId: string }): CloseFindOutcome => {
  return FindWidgetLifecycle.requestCloseFromWidget(context.editorUid, context.instanceId)
}
