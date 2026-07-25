import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.file-not-found'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/not-found.txt`
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const errorEditor = Locator('.TextEditorError')
  const errorMessage = Locator('.TextEditorErrorMessage')
  await expect(errorEditor).toHaveCSS('flex-grow', '1')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('The editor could not be opened because the file was not found')
}
