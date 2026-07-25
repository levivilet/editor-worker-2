import type { Test } from '@lvce-editor/test-with-playwright'
import { openAbout, pressEscapeUntilHidden } from './_about.js'

export const name = 'about.keyboard-escape'

export const test: Test = async ({ About, expect, KeyBoard, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  await pressEscapeUntilHidden(KeyBoard, expect, dialogContent)
}
