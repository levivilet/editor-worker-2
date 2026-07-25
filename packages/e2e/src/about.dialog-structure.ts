import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, openAbout } from './_about.js'

export const name = 'about.dialog-structure'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)
  const aboutView = Locator('.Viewlet.About')

  try {
    await expect(aboutView).toHaveCount(1)
    await expect(dialogContent).toHaveCount(1)
    await expect(dialogContent.locator('.DialogToolBarRow')).toHaveCount(1)
    await expect(dialogContent.locator('.DialogMessageRow')).toHaveCount(1)
    await expect(dialogContent.locator('.DialogContentRight')).toHaveCount(1)
    await expect(dialogContent.locator('.DialogHeading')).toHaveCount(1)
    await expect(dialogContent.locator('.DialogMessage')).toHaveCount(1)
    await expect(dialogContent.locator('.DialogButtonsRow')).toHaveCount(1)
  } finally {
    await closeAbout(aboutApi)
  }
}
