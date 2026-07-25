import type { AboutState } from '../AboutState/AboutState.ts'
import * as CreateViewModel from '../CreateViewModel/CreateViewModel.ts'
import * as GetAboutVirtualDom from '../GetAboutVirtualDom/GetAboutVirtualDom.ts'

export const renderDialog = (oldState: AboutState, newState: AboutState): readonly any[] => {
  const { closeMessage, copyMessage, infoMessage, lines, okMessage, productName } = CreateViewModel.createViewModel(newState)
  const dom = GetAboutVirtualDom.getAboutVirtualDom(productName, lines, closeMessage, okMessage, copyMessage, infoMessage)
  return ['Viewlet.setDom2', dom]
}
