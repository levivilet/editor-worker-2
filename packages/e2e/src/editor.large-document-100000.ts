import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.large-document-100000'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/large.txt`
  const content = Array.from({ length: 100_000 }, (_, index) => `line ${index}`).join('\n')
  await FileSystem.writeFile(filePath, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(43)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('line 0')

  await Command.execute('Editor.cursorDocumentEnd')
  await Command.execute('Editor.updateDiagnostics')

  await expect(lines).toHaveCount(43)
  const lastLine = lines.nth(42)
  await expect(lastLine).toHaveText('line 99999')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '99999')

  await Command.execute('Editor.type', '!')
  const updatedLastLine = lines.nth(42)
  await expect(updatedLastLine).toHaveText('line 99999!')
  await expect(cursor).toHaveAttribute('data-column-index', '11')
}
