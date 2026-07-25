import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.selection-rectangles'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/selection.txt`
  await FileSystem.writeFile(filePath, 'first\nsecond\nthird')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  await Command.execute('Editor.setSelections2', new Uint32Array([0, 2, 2, 3]))
  await Command.execute('Editor.updateDiagnostics')

  const selections = Locator('.EditorSelection')
  await expect(selections).toHaveCount(3)
  const firstSelection = selections.nth(0)
  const secondSelection = selections.nth(1)
  const thirdSelection = selections.nth(2)
  await expect(firstSelection).toHaveCSS('width', '27px')
  await expect(secondSelection).toHaveCSS('width', '54px')
  await expect(thirdSelection).toHaveCSS('width', '27px')
}
