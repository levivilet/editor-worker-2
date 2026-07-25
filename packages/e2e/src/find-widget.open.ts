import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget.open'
export const skip = 1

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'test')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Editor.openFind()

  const findWidget = Locator('.FindWidget')
  const findInput = Locator('.FindWidget .MultilineInputBox')
  await expect(findWidget).toBeVisible()
  await expect(findInput).toBeVisible()
  await expect(findInput).toHaveValue('')
}
