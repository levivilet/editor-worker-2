import type { AboutState } from '../AboutState/AboutState.ts'
import type { ViewModel } from '../ViewModel/ViewModel.ts'
import * as AboutStrings from '../AboutStrings/AboutStrings.ts'

export const createViewModel = (state: AboutState): ViewModel => {
  const okMessage = AboutStrings.ok()
  const copyMessage = AboutStrings.copy()
  const closeMessage = AboutStrings.closeDialog()
  const infoMessage = AboutStrings.info()
  const { lines, productName } = state
  return {
    closeMessage,
    copyMessage,
    infoMessage,
    lines,
    okMessage,
    productName,
  }
}
