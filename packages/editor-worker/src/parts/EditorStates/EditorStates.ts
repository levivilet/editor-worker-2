import type { EditorState } from '../EditorState/EditorState.ts'
import * as EditorMetrics from '../EditorMetrics/EditorMetrics.ts'

const states = new Map<number, EditorState>()
const renderedStates = new Map<number, EditorState>()

export const create = (uid: number, uri = '', languageId = 'plaintext', tokenizePath = '', x = 0, y = 0, width = 0, height = 0): EditorState => {
  const state: EditorState = {
    columnWidth: EditorMetrics.ColumnWidth,
    diagnostics: [],
    height,
    languageId,
    lineCount: 0,
    lineNumbers: true,
    lines: [],
    longestLineWidth: 0,
    maxLineY: 0,
    minLineY: 0,
    rowHeight: EditorMetrics.RowHeight,
    scrollBarWidth: 0,
    selections: new Uint32Array([0, 0, 0, 0]),
    tokenizedLines: [],
    tokenizePath,
    uid,
    uri,
    width,
    x,
    y,
  }
  states.set(uid, state)
  return state
}

export const dispose = (uid: number): void => {
  states.delete(uid)
  renderedStates.delete(uid)
}

export const get = (uid: number): EditorState => {
  const state = states.get(uid)
  if (!state) {
    throw new Error(`Editor state not found: ${uid}`)
  }
  return state
}

export const set = (state: EditorState): void => {
  const { uid } = state
  states.set(uid, state)
}

export const getRendered = (uid: number): EditorState | undefined => {
  return renderedStates.get(uid)
}

export const setRendered = (state: EditorState): void => {
  const { uid } = state
  renderedStates.set(uid, state)
}
