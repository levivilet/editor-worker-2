import type { EditorState } from '../EditorState/EditorState.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RenderIncremental from '../RenderIncremental/RenderIncremental.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

const render = (diff: number, oldState: EditorState, newState: EditorState): readonly unknown[] => {
  switch (diff) {
    case DiffType.RenderIncremental:
      return RenderIncremental.renderIncremental(oldState, newState)
    case DiffType.RenderItems:
      return RenderItems.renderItems(newState)
    default:
      throw new Error(`Unknown editor diff: ${diff}`)
  }
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly (readonly unknown[])[] => {
  const newState = EditorStates.get(uid)
  const oldState = EditorStates.getRendered(uid) || newState
  const commands = Array.from(diffResult, (diff) => render(diff, oldState, newState))
  EditorStates.setRendered(newState)
  return commands
}
