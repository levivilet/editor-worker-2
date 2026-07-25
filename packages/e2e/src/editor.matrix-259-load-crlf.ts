import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-259-load-crlf'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-259.txt`
  await FileSystem.writeFile(filePath, 'load-8\r\nsecond-8\r\nthird-8')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))

  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(3)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('load-8')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('second-8')
  const line2 = lines.nth(2)
  await expect(line2).toHaveText('third-8')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
