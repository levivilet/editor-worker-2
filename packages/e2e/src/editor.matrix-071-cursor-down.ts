import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-071-cursor-down'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-071.txt`
  await FileSystem.writeFile(filePath, 'xxxxxx\nxxxxxx')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 4, 0, 4]))
  await Command.execute('Editor.cursorDown')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(2)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('xxxxxx')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('xxxxxx')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '1')
  await expect(cursor).toHaveAttribute('data-column-index', '4')
}
