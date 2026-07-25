import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.cursor-click'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'first line\nsecond line\nthird line')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const editor = Locator('.EditorContent')
  const renderedLines = Locator('.EditorLine')
  const cursor = Locator('.EditorCursor')
  await expect(editor).toHaveCount(1)
  await expect(renderedLines).toHaveCount(3)
  await expect(cursor).toHaveAttribute('data-column-index', '0')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await Command.execute('Editor.handleClick', 100_000, 100_000)

  const movedCursor = Locator('.EditorCursor')
  await expect(movedCursor).toHaveCSS('translate', '90px 40px')
}
