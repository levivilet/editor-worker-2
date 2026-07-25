import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-270-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-270.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-9-0\nscroll-9-1\nscroll-9-2\nscroll-9-3\nscroll-9-4\nscroll-9-5\nscroll-9-6\nscroll-9-7\nscroll-9-8\nscroll-9-9\nscroll-9-10\nscroll-9-11\nscroll-9-12\nscroll-9-13\nscroll-9-14\nscroll-9-15\nscroll-9-16\nscroll-9-17\nscroll-9-18\nscroll-9-19\nscroll-9-20\nscroll-9-21\nscroll-9-22\nscroll-9-23\nscroll-9-24\nscroll-9-25\nscroll-9-26\nscroll-9-27\nscroll-9-28\nscroll-9-29\nscroll-9-30\nscroll-9-31\nscroll-9-32\nscroll-9-33\nscroll-9-34\nscroll-9-35\nscroll-9-36\nscroll-9-37\nscroll-9-38\nscroll-9-39\nscroll-9-40\nscroll-9-41\nscroll-9-42\nscroll-9-43\nscroll-9-44\nscroll-9-45\nscroll-9-46\nscroll-9-47\nscroll-9-48\nscroll-9-49\nscroll-9-50\nscroll-9-51\nscroll-9-52\nscroll-9-53\nscroll-9-54\nscroll-9-55\nscroll-9-56\nscroll-9-57\nscroll-9-58\nscroll-9-59\nscroll-9-60\nscroll-9-61\nscroll-9-62\nscroll-9-63\nscroll-9-64\nscroll-9-65\nscroll-9-66\nscroll-9-67\nscroll-9-68\nscroll-9-69\nscroll-9-70\nscroll-9-71\nscroll-9-72\nscroll-9-73\nscroll-9-74\nscroll-9-75\nscroll-9-76\nscroll-9-77\nscroll-9-78\nscroll-9-79\nscroll-9-80\nscroll-9-81\nscroll-9-82\nscroll-9-83\nscroll-9-84\nscroll-9-85\nscroll-9-86\nscroll-9-87\nscroll-9-88\nscroll-9-89\nscroll-9-90\nscroll-9-91\nscroll-9-92\nscroll-9-93\nscroll-9-94\nscroll-9-95\nscroll-9-96\nscroll-9-97\nscroll-9-98\nscroll-9-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-9-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
