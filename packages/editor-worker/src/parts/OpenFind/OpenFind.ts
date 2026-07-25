import type { OpenFindOutcome } from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'
import * as FindWidgetLifecycle from '../FindWidgetLifecycle/FindWidgetLifecycle.ts'

export const openFind = (uid: number): Promise<OpenFindOutcome> => {
  return FindWidgetLifecycle.open(uid)
}
