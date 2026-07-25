import * as EditorStates from '../EditorStates/EditorStates.ts'

export const setSelections2 = (uid: number, selections: Uint32Array): void => {
  if (selections.length === 0 || selections.length % 4 !== 0) {
    throw new Error('Editor selections must contain one or more groups of four values')
  }
  const state = EditorStates.get(uid)
  EditorStates.set({
    ...state,
    selections: new Uint32Array(selections),
  })
}
