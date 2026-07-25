import type { Test } from '@lvce-editor/test-with-playwright'
import { getCopyButton, openAbout, pressEscapeUntilHidden, waitForFocused } from './_about.js'

export const name = 'about.keyboard-escape-after-focus-change'

export const test: Test = async ({ About, expect, KeyBoard, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  await KeyBoard.press('Tab')
  await waitForFocused(expect, getCopyButton(dialogContent))
  await pressEscapeUntilHidden(KeyBoard, expect, dialogContent)
}
