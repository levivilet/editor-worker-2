import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-172-delete-right'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-172.txt`
  await FileSystem.writeFile(filePath, '-----z')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 5, 0, 5]))
  await Command.execute('Editor.deleteCharacterRight')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('-----')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '5')
}
