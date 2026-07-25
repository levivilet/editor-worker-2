import type { Test } from '@lvce-editor/test-with-playwright'
import { getHeading, getMessage } from './_about.js'

export const name = 'about.text-selection'

export const test: Test = async ({ About, expect, Locator }) => {
  await About.show()
  const dialogContent = Locator('.DialogContent').first()

  try {
    // WebKit exposes user-select through the prefixed computed style property.
    await expect(getHeading(dialogContent)).toHaveCSS('-webkit-user-select', 'text')
    await expect(getMessage(dialogContent)).toHaveCSS('-webkit-user-select', 'text')
  } finally {
    await About.handleClickClose()
  }
}
