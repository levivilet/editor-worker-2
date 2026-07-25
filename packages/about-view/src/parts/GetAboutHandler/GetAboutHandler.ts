import type { AboutHandler } from '../AboutHandler/AboutHandler.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as ShowAboutDefault from '../ShowAboutDefault/ShowAboutDefault.ts'
import * as ShowAboutElectron from '../ShowAboutElectron/ShowAboutElectron.ts'

export const getAboutHandler = (platform: number): AboutHandler => {
  switch (platform) {
    case PlatformType.Electron:
      return ShowAboutElectron.showAboutElectron
    default:
      return ShowAboutDefault.showAboutDefault
  }
}
