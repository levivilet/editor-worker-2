import * as EditorStates from '../EditorStates/EditorStates.ts'

export const openFind = (uid: number): void => {
  const state = EditorStates.get(uid)
  EditorStates.set({
    ...state,
    findWidgetVisible: true,
  })
}
