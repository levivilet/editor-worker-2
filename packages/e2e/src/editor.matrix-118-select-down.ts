import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-118-select-down'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-118.txt`
  await FileSystem.writeFile(filePath, 'aaaa beta\naaaa beta')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 4, 0, 4]))
  await Command.execute('Editor.selectDown')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(2)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('aaaa beta')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('aaaa beta')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '1')
  await expect(cursor).toHaveAttribute('data-column-index', '4')
}
