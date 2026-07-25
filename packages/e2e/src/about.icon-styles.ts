import type { Test } from '@lvce-editor/test-with-playwright'
import { closeAbout, getCloseButton, getInfoIcon, openAbout } from './_about.js'

export const name = 'about.icon-styles'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }
  const dialogContent = await openAbout(aboutApi)
  const infoIcon = getInfoIcon(dialogContent)
  const closeIcon = getCloseButton(dialogContent).locator('.MaskIconClose')

  try {
    await expect(infoIcon).toHaveClass('DialogIcon')
    await expect(infoIcon).toHaveClass('DialogInfoIcon')
    await expect(infoIcon).toHaveClass('MaskIcon')
    await expect(infoIcon).toHaveClass('MaskIconInfo')
    await expect(closeIcon).toHaveClass('MaskIcon')
    await expect(closeIcon).toHaveClass('MaskIconClose')
  } finally {
    await closeAbout(aboutApi)
  }
}
