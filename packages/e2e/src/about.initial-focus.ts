import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getOkButton, openAbout, waitForFocused } from './_about.js'

export const name = 'about.initial-focus'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await waitForFocused(expect, getOkButton(dialogContent))
  } finally {
    await closeAbout(aboutApi)
  }
}
