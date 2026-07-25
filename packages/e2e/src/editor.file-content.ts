import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.file-content'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'first line\nsecond line\nthird line')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const lines = Locator('.EditorLine')
  const firstLine = lines.nth(0)
  const secondLine = lines.nth(1)
  const thirdLine = lines.nth(2)
  await expect(lines).toHaveCount(3)
  await expect(firstLine).toHaveText('first line')
  await expect(secondLine).toHaveText('second line')
  await expect(thirdLine).toHaveText('third line')
}
