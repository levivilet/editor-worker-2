import type { Test } from '@lvce-editor/test-with-playwright'
import { assertAboutContent, closeAbout, openAbout } from './_about.js'

export const name = 'about.open'

export const test: Test = async (api) => {
  const dialogContent = await openAbout(api)
  try {
    await assertAboutContent(api, dialogContent)
  } finally {
    await closeAbout(api)
  }
}
