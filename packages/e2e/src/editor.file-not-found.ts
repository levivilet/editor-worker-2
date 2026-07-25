import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.file-not-found'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/not-found.txt`
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const errorEditor = Locator('.TextEditorError')
  await expect(errorEditor).toBeVisible()
}
