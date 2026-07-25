import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.horizontal-scrollbar'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/long-line.txt`
  await FileSystem.writeFile(filePath, 'x'.repeat(1000))
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const horizontalScrollBar = Locator('.ScrollBarHorizontal')
  const horizontalScrollBarThumb = Locator('.ScrollBarThumbHorizontal')
  await expect(horizontalScrollBar).toBeVisible()
  await expect(horizontalScrollBarThumb).toBeVisible()
}
