import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, openAbout } from './_about.js'

export const name = 'about.dialog-content-padding'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)

  try {
    await expect(dialogContent).toHaveCSS('padding-top', '10px')
    await expect(dialogContent).toHaveCSS('padding-right', '10px')
    await expect(dialogContent).toHaveCSS('padding-bottom', '10px')
    await expect(dialogContent).toHaveCSS('padding-left', '10px')
  } finally {
    await closeAbout(aboutApi)
  }
}
