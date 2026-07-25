import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getOkButton, openAbout } from './_about.js'

export const name = 'about.reopen'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const firstDialogContent = await openAbout(aboutApi)
  await closeAbout(aboutApi)
  await expect(firstDialogContent).toBeHidden()

  const secondDialogContent = await openAbout(aboutApi)
  try {
    await expect(getOkButton(secondDialogContent)).toBeFocused()
  } finally {
    await closeAbout(aboutApi)
  }
}
