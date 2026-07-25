import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  EditorStates.get(uid)
  return [DiffType.RenderItems]
}
