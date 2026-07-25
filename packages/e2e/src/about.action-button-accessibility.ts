import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, openAbout } from './_about.js'

export const name = 'about.action-button-accessibility'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await expect(dialogContent.locator('button.Button')).toHaveCount(2)
    await expect(dialogContent.locator('button.ButtonSecondary[name="Ok"]')).toHaveText('Ok')
    await expect(dialogContent.locator('button.ButtonPrimary[name="Copy"]')).toHaveText('Copy')
    await expect(dialogContent.locator('.Button:not(button)')).toHaveCount(0)
  } finally {
    await closeAbout(aboutApi)
  }
}
