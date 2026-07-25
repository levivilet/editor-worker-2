import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.input'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'first line')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const editorInput = Locator('.EditorInput')
  const textArea = editorInput.locator('textarea')
  await expect(editorInput).toHaveCSS('opacity', '0')
  await expect(textArea).toHaveCount(1)
  await expect(textArea).toHaveValue('first line')

  await textArea.type('updated first line\nsecond line')
  await expect(textArea).toHaveValue('updated first line\nsecond line')
  // Flush the asynchronous input command before checking the rendered lines.
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  const firstLine = lines.nth(0)
  const secondLine = lines.nth(1)
  await expect(lines).toHaveCount(2)
  await expect(firstLine).toHaveText('updated first line')
  await expect(secondLine).toHaveText('second line')
}
