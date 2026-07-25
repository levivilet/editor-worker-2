import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.file-content'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'first line\nsecond line\nthird line')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const gutter = Locator('.Gutter')
  const lineNumbers = Locator('.LineNumber')
  const lines = Locator('.EditorLine')
  const firstLineNumber = lineNumbers.nth(0)
  const secondLineNumber = lineNumbers.nth(1)
  const thirdLineNumber = lineNumbers.nth(2)
  const firstLine = lines.nth(0)
  const secondLine = lines.nth(1)
  const thirdLine = lines.nth(2)
  const horizontalScrollBar = Locator('.ScrollBarHorizontal')
  await expect(gutter).toBeVisible()
  await expect(lineNumbers).toHaveCount(3)
  await expect(firstLineNumber).toHaveText('1')
  await expect(secondLineNumber).toHaveText('2')
  await expect(thirdLineNumber).toHaveText('3')
  await expect(lines).toHaveCount(3)
  await expect(firstLine).toHaveText('first line')
  await expect(secondLine).toHaveText('second line')
  await expect(thirdLine).toHaveText('third line')
  await expect(horizontalScrollBar).toHaveCount(0)
}
