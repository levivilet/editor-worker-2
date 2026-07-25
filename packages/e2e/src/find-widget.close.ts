import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'find-widget.close'

export const test: Test = async ({ Editor, expect, FileSystem, FindWidget, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/test.txt`
  await FileSystem.writeFile(filePath, 'test')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Editor.openFind()

  await FindWidget.close()

  const findWidget = Locator('.FindWidget')
  await expect(findWidget).toHaveCount(0)
}
