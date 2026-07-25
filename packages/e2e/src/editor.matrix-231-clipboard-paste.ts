import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-231-clipboard-paste'

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-231.txt`
  await FileSystem.writeFile(filePath, 'clip-5')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await ClipBoard.enableMemoryClipBoard()
  await ClipBoard.writeText('p5\nq5')
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 6, 0, 6]))
  await Command.execute('Editor.paste')
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(2)
  const line0 = lines.nth(0)
  await expect(line0).toHaveText('clip-5p5')
  const line1 = lines.nth(1)
  await expect(line1).toHaveText('q5')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '1')
  await expect(cursor).toHaveAttribute('data-column-index', '2')
}
