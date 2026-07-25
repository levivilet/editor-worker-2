import { expect, test } from '@jest/globals'
import * as GetAboutHandler from '../src/parts/GetAboutHandler/GetAboutHandler.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'
import * as ShowAboutDefault from '../src/parts/ShowAboutDefault/ShowAboutDefault.ts'
import * as ShowAboutElectron from '../src/parts/ShowAboutElectron/ShowAboutElectron.ts'

test('getAboutHandler - returns electron handler for electron platform', () => {
  const handler = GetAboutHandler.getAboutHandler(PlatformType.Electron)
  expect(handler).toBe(ShowAboutElectron.showAboutElectron)
})

test('getAboutHandler - returns default handler for web platform', () => {
  const handler = GetAboutHandler.getAboutHandler(PlatformType.Web)
  expect(handler).toBe(ShowAboutDefault.showAboutDefault)
})

test('getAboutHandler - returns default handler for test platform', () => {
  const handler = GetAboutHandler.getAboutHandler(PlatformType.Test)
  expect(handler).toBe(ShowAboutDefault.showAboutDefault)
})
