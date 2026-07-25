import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-232-clipboard-copy'

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-232.txt`
  await FileSystem.writeFile(filePath, 'copy source 6')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await ClipBoard.enableMemoryClipBoard()
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 4]))
  await Command.execute('Editor.copy')
  await Command.execute('Editor.cursorSet', 0, 13)
  await Command.execute('Editor.paste')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('copy source 6copy')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '17')
}
