import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-242-clipboard-cut'

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-242.txt`
  await FileSystem.writeFile(filePath, 'cut source 16')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await ClipBoard.enableMemoryClipBoard()
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 3]))
  await Command.execute('Editor.cut')
  await Command.execute('Editor.paste')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('cut source 16')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '3')
}
