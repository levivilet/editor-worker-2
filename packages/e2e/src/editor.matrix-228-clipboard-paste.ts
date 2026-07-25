import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-228-clipboard-paste'

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-228.txt`
  await FileSystem.writeFile(filePath, 'clip-2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('paste-2')
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 6, 0, 6]))
  await Command.execute('Editor.paste')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(1)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('clip-2paste-2')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '13')
}
