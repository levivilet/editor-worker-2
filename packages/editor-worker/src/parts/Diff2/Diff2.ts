import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

const hasSelectionRange = (selections: Uint32Array): boolean => {
  for (let index = 0; index < selections.length; index += 4) {
    if (selections[index] !== selections[index + 2] || selections[index + 1] !== selections[index + 3]) {
      return true
    }
  }
  return false
}

export const diff2 = (uid: number): readonly number[] => {
  const newState = EditorStates.get(uid)
  const oldState = EditorStates.getRendered(uid)
  if (!oldState) {
    return [DiffType.RenderItems, DiffType.RenderCss]
  }
  if (oldState.selections !== newState.selections) {
    if (
      oldState.minLineY !== newState.minLineY ||
      oldState.maxLineY !== newState.maxLineY ||
      hasSelectionRange(oldState.selections) ||
      hasSelectionRange(newState.selections)
    ) {
      return [DiffType.RenderItems, DiffType.RenderCss]
    }
    return [DiffType.RenderIncremental, DiffType.RenderCss]
  }
  if (
    oldState.diagnostics === newState.diagnostics &&
    oldState.errorMessage === newState.errorMessage &&
    oldState.lines === newState.lines &&
    oldState.lineNumbers === newState.lineNumbers
  ) {
    return []
  }
  return [DiffType.RenderIncremental]
}
