import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const newState = EditorStates.get(uid)
  const oldState = EditorStates.getRendered(uid)
  if (!oldState) {
    return [DiffType.RenderItems]
  }
  if (oldState.diagnostics === newState.diagnostics && oldState.lines === newState.lines) {
    return []
  }
  return [DiffType.RenderIncremental]
}
