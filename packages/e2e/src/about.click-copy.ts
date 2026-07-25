import type { Test } from '@lvce-editor/test-with-playwright'
import { getCopyButton, openAbout } from './_about.js'

export const name = 'about.click-copy'

export const test: Test = async ({ About, ClipBoard, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }

  // arrange
  const dialogContent = await openAbout(aboutApi)
  await ClipBoard.enableMemoryClipBoard()

  try {
    // act
    // eslint-disable-next-line e2e/no-direct-click -- verifies the rendered Copy button invokes the clipboard action
    await getCopyButton(dialogContent).click()

    // assert
    await expect(dialogContent).toBeHidden()
    await ClipBoard.shouldHaveText(/Version: [^\n]*\nCommit: [^\n]*\nDate: [^\n]*\nBrowser: /)
  } finally {
    await ClipBoard.disableMemoryClipBoard()
  }
}
