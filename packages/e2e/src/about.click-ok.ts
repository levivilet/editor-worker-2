import type { Test } from '@lvce-editor/test-with-playwright'
import { getOkButton, openAbout } from './_about.js'

export const name = 'about.click-ok'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }

  // arrange
  const dialogContent = await openAbout(aboutApi)

  // act
  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered Ok button is wired to the close command
  await getOkButton(dialogContent).click()

  // assert
  await expect(dialogContent).toBeHidden()
}
