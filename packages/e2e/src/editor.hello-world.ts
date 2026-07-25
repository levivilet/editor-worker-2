import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.hello-world'

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/hello.txt`
  await FileSystem.writeFile(filePath, '')
  await Workspace.setPath(tmpDir)

  await Main.openUri(filePath)

  const heading = Locator('h1')
  await expect(heading).toBeVisible()
  await expect(heading).toHaveText('Hello World')
}
