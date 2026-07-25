import type { Test } from '@lvce-editor/test-with-playwright'
import { getCloseButton, openAbout } from './_about.js'

export const name = 'about.click-close'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }

  // arrange
  const dialogContent = await openAbout(aboutApi)

  // act
  // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered close control is wired to the close command
  await getCloseButton(dialogContent).click()

  // assert
  await expect(dialogContent).toBeHidden()
}
