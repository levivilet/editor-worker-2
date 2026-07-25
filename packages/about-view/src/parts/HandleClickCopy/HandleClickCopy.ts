import type { AboutState } from '../AboutState/AboutState.ts'
import * as Close from '../Close/Close.ts'
import * as Copy from '../Copy/Copy.ts'

export const handleClickCopy = async (state: AboutState): Promise<AboutState> => {
  const { lines } = state
  await Copy.copy(lines)
  await Close.close()
  return state
}
