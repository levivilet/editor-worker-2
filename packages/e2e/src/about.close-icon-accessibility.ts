import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getCloseButton, openAbout } from './_about.js'

export const name = 'about.close-icon-accessibility'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)
  const closeButton = getCloseButton(dialogContent)

  try {
    await expect(closeButton).toHaveAttribute('aria-label', 'Close Dialog')
    await expect(closeButton.locator('.MaskIconClose')).toHaveCount(1)
    await expect(dialogContent.locator('.MaskIconClose[aria-label]')).toHaveCount(0)
    await expect(dialogContent.locator('.MaskIconClose[role]')).toHaveCount(0)
  } finally {
    await closeAbout(aboutApi)
  }
}
