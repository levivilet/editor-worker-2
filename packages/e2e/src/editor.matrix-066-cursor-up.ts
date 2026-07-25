import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-066-cursor-up'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-066.txt`
  await FileSystem.writeFile(filePath, 'xxxxx\nxxxxx')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([1, 3, 1, 3]))
  await Command.execute('Editor.cursorUp')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(2)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('xxxxx')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('xxxxx')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '3')
}
