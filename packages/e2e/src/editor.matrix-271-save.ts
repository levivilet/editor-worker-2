import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-271-save'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-271.txt`
  await FileSystem.writeFile(filePath, 'save-0')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 6, 0, 6]))
  await Command.execute('Editor.type', '-updated-0')
  await Command.execute('Editor.save')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('save-0-updated-0')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '16')

  const savedText = await FileSystem.readFile(filePath)
  if (savedText !== 'save-0-updated-0') {
    throw new Error(`Expected saved text "save-0-updated-0" but received ${savedText}`)
  }
}
