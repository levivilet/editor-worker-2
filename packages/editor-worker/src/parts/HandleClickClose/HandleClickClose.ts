import type { AboutState } from '../AboutState/AboutState.ts'
import * as Close from '../Close/Close.ts'

export const handleClickClose = async (state: AboutState): Promise<AboutState> => {
  await Close.close()
  return state
}
