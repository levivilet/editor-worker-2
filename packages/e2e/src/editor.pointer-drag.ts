import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.pointer-drag'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/pointer-drag.txt`
  await FileSystem.writeFile(filePath, 'first\nsecond\nthird')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Command.execute('Editor.pointerDown', 0, 0)
  await Command.execute('Editor.pointerMove', 100_000, 100_000, 1)
  await Command.execute('Editor.pointerUp', 100_000, 100_000)

  const selections = Locator('.EditorSelection')
  await expect(selections).toHaveCount(3)
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '2')
  await expect(cursor).toHaveAttribute('data-column-index', '5')
}
