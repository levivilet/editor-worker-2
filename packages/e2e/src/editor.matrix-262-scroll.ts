import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-262-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-262.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-1-0\nscroll-1-1\nscroll-1-2\nscroll-1-3\nscroll-1-4\nscroll-1-5\nscroll-1-6\nscroll-1-7\nscroll-1-8\nscroll-1-9\nscroll-1-10\nscroll-1-11\nscroll-1-12\nscroll-1-13\nscroll-1-14\nscroll-1-15\nscroll-1-16\nscroll-1-17\nscroll-1-18\nscroll-1-19\nscroll-1-20\nscroll-1-21\nscroll-1-22\nscroll-1-23\nscroll-1-24\nscroll-1-25\nscroll-1-26\nscroll-1-27\nscroll-1-28\nscroll-1-29\nscroll-1-30\nscroll-1-31\nscroll-1-32\nscroll-1-33\nscroll-1-34\nscroll-1-35\nscroll-1-36\nscroll-1-37\nscroll-1-38\nscroll-1-39\nscroll-1-40\nscroll-1-41\nscroll-1-42\nscroll-1-43\nscroll-1-44\nscroll-1-45\nscroll-1-46\nscroll-1-47\nscroll-1-48\nscroll-1-49\nscroll-1-50\nscroll-1-51\nscroll-1-52\nscroll-1-53\nscroll-1-54\nscroll-1-55\nscroll-1-56\nscroll-1-57\nscroll-1-58\nscroll-1-59\nscroll-1-60\nscroll-1-61\nscroll-1-62\nscroll-1-63\nscroll-1-64\nscroll-1-65\nscroll-1-66\nscroll-1-67\nscroll-1-68\nscroll-1-69\nscroll-1-70\nscroll-1-71\nscroll-1-72\nscroll-1-73\nscroll-1-74\nscroll-1-75\nscroll-1-76\nscroll-1-77\nscroll-1-78\nscroll-1-79\nscroll-1-80\nscroll-1-81\nscroll-1-82\nscroll-1-83\nscroll-1-84\nscroll-1-85\nscroll-1-86\nscroll-1-87\nscroll-1-88\nscroll-1-89\nscroll-1-90\nscroll-1-91\nscroll-1-92\nscroll-1-93\nscroll-1-94\nscroll-1-95\nscroll-1-96\nscroll-1-97\nscroll-1-98\nscroll-1-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-1-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
