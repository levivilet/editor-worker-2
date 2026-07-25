import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getCopyButton, getOkButton, openAbout, waitForFocused } from './_about.js'

export const name = 'about.keyboard-tab-wraparound'

export const test: Test = async ({ About, expect, KeyBoard, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await KeyBoard.press('Tab')
    await waitForFocused(expect, getCopyButton(dialogContent))

    await KeyBoard.press('Tab')
    await waitForFocused(expect, getOkButton(dialogContent))
  } finally {
    await closeAbout(aboutApi)
  }
}
