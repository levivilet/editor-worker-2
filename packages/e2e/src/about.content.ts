import type { Test } from '@lvce-editor/test-with-playwright'
import { assertAboutContent, closeAbout, getMessage, openAbout } from './_about.js'

export const name = 'about.content'

export const test: Test = async (api) => {
  const dialogContent = await openAbout(api)

  try {
    await assertAboutContent(api, dialogContent)
    await api.expect(getMessage(dialogContent)).toContainText('Browser: ')
  } finally {
    await closeAbout(api)
  }
}
