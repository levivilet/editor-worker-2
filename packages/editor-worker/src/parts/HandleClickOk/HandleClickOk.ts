import type { AboutState } from '../AboutState/AboutState.ts'
import * as Close from '../Close/Close.ts'

export const handleClickOk = async (state: AboutState): Promise<AboutState> => {
  await Close.close()
  return state
}
