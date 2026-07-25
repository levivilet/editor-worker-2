import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-253-load-crlf'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-253.txt`
  await FileSystem.writeFile(filePath, 'load-2\r\nsecond-2\r\nthird-2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))

  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(3)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('load-2')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('second-2')
  const line2 = lines.nth(2)
  await expect(line2).toHaveText('third-2')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
