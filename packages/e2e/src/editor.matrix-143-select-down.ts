import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-143-select-down'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-143.txt`
  await FileSystem.writeFile(filePath, 'aaaaaaaaa beta\naaaaaaaaa beta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 9, 0, 9]))
  await Command.execute('Editor.selectDown')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(2)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('aaaaaaaaa beta')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('aaaaaaaaa beta')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '1')
  await expect(cursor).toHaveAttribute('data-column-index', '9')
}
