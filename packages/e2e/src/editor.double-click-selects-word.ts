import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.double-click-selects-word'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'first second')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  await Command.execute('Editor.handleClick', 100_000, 100_000, 2)
  await Command.execute('Editor.deleteCharacterLeft')

  const textArea = Locator('.EditorInput').locator('textarea')
  await expect(textArea).toHaveValue('first ')
}
