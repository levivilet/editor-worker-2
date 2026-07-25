import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-018-type-replace'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-018.txt`
  await FileSystem.writeFile(filePath, 'base-3')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 1, 0, 4]))
  await Command.execute('Editor.type', 'r3')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('br3-3')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '3')
}
