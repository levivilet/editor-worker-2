import * as DiffType from '../DiffType/DiffType.ts'
import * as EditorStates from '../EditorStates/EditorStates.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const render2 = (uid: number, diffResult: readonly number[]): readonly (readonly unknown[])[] => {
  const state = EditorStates.get(uid)
  const commands: (readonly unknown[])[] = []
  for (const diff of diffResult) {
    if (diff !== DiffType.RenderItems) {
      throw new Error(`Unknown editor diff: ${diff}`)
    }
    commands.push(RenderItems.renderItems(state))
  }
  return commands
}
