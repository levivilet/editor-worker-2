import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, openAbout } from './_about.js'

export const name = 'about.dialog-focusability'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await expect(dialogContent).toHaveAttribute('tabindex', '-1')
  } finally {
    await closeAbout(aboutApi)
  }
}
