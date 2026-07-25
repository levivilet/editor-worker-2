import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getCopyButton, getOkButton, openAbout, waitForFocused } from './_about.js'

export const name = 'about.keyboard-shift-tab-wraparound'

export const skip = 1

export const test: Test = async ({ About, expect, KeyBoard, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await KeyBoard.press('Shift+Tab')
    await waitForFocused(expect, getCopyButton(dialogContent))

    await KeyBoard.press('Shift+Tab')
    await waitForFocused(expect, getOkButton(dialogContent))
  } finally {
    await closeAbout(aboutApi)
  }
}
