import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-252-load-crlf'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-252.txt`
  await FileSystem.writeFile(filePath, 'load-1\r\nsecond-1\r\nthird-1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))

  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(3)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('load-1')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('second-1')
  const line2 = lines.nth(2)
  await expect(line2).toHaveText('third-1')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
