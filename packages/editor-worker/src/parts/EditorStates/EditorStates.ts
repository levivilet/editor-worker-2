import type { EditorState } from '../EditorState/EditorState.ts'

const states = new Map<number, EditorState>()

export const create = (uid: number): EditorState => {
  const state: EditorState = {
    uid,
  }
  states.set(uid, state)
  return state
}

export const dispose = (uid: number): void => {
  states.delete(uid)
}

export const get = (uid: number): EditorState => {
  const state = states.get(uid)
  if (!state) {
    throw new Error(`Editor state not found: ${uid}`)
  }
  return state
}
