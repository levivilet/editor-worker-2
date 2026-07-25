import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getOkButton, openAbout, waitForFocused } from './_about.js'

export const name = 'about.reopen-after-ok'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const firstDialogContent = await openAbout(aboutApi)
  await About.handleClickOk()
  await expect(firstDialogContent).toBeHidden()

  const secondDialogContent = await openAbout(aboutApi)
  try {
    await waitForFocused(expect, getOkButton(secondDialogContent))
  } finally {
    await closeAbout(aboutApi)
  }
}
