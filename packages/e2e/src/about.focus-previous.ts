import type { Test, TestApi } from '@lvce-editor/test-with-playwright'
import { closeAbout, getCopyButton, getOkButton, openAbout } from './_about.js'

type Expect = TestApi['expect']
type Locator = ReturnType<TestApi['Locator']>

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    const { setTimeout } = globalThis as any
    setTimeout(resolve, ms)
  })
}

const waitForFocused = async (expect: Expect, locator: Locator): Promise<void> => {
  let lastError: unknown
  for (let i = 0; i < 20; i++) {
    try {
      await expect(locator).toBeFocused()
      return
    } catch (error) {
      lastError = error
      await wait(50)
    }
  }
  throw lastError
}

export const name = 'about.focus-previous'

export const test: Test = async ({ About, expect, Locator }) => {
  const aboutApi = { About, expect, Locator }

  // arrange
  const dialogContent = await openAbout(aboutApi)
  const okButton = getOkButton(dialogContent)
  const copyButton = getCopyButton(dialogContent)

  try {
    // act
    await About.focusPrevious()

    // assert
    await waitForFocused(expect, copyButton)
    await wait(50)

    // act
    await About.focusPrevious()

    // assert
    await waitForFocused(expect, okButton)
  } finally {
    await closeAbout(aboutApi)
  }
}
