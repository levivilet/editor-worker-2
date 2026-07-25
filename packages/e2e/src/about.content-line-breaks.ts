import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getMessage, openAbout } from './_about.js'

export const name = 'about.content-line-breaks'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await expect(getMessage(dialogContent).locator('br')).toHaveCount(3)
  } finally {
    await closeAbout(aboutApi)
  }
}
