import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const newState = EditorStates.get(uid)
  const oldState = EditorStates.getRendered(uid)
  if (!oldState) {
    return [DiffType.RenderItems, DiffType.RenderCss]
  }
  if (oldState.selections !== newState.selections) {
    return [DiffType.RenderIncremental, DiffType.RenderCss]
  }
  if (
    oldState.diagnostics === newState.diagnostics &&
    oldState.findWidgetVisible === newState.findWidgetVisible &&
    oldState.lines === newState.lines &&
    oldState.lineNumbers === newState.lineNumbers
  ) {
    return []
  }
  return [DiffType.RenderIncremental]
}
