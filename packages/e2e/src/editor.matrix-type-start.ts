import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-type-start'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'world')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.type', 'hello ')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('hello world')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-column-index', '6')
}
