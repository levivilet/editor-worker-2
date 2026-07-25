import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-264-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-264.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-3-0\nscroll-3-1\nscroll-3-2\nscroll-3-3\nscroll-3-4\nscroll-3-5\nscroll-3-6\nscroll-3-7\nscroll-3-8\nscroll-3-9\nscroll-3-10\nscroll-3-11\nscroll-3-12\nscroll-3-13\nscroll-3-14\nscroll-3-15\nscroll-3-16\nscroll-3-17\nscroll-3-18\nscroll-3-19\nscroll-3-20\nscroll-3-21\nscroll-3-22\nscroll-3-23\nscroll-3-24\nscroll-3-25\nscroll-3-26\nscroll-3-27\nscroll-3-28\nscroll-3-29\nscroll-3-30\nscroll-3-31\nscroll-3-32\nscroll-3-33\nscroll-3-34\nscroll-3-35\nscroll-3-36\nscroll-3-37\nscroll-3-38\nscroll-3-39\nscroll-3-40\nscroll-3-41\nscroll-3-42\nscroll-3-43\nscroll-3-44\nscroll-3-45\nscroll-3-46\nscroll-3-47\nscroll-3-48\nscroll-3-49\nscroll-3-50\nscroll-3-51\nscroll-3-52\nscroll-3-53\nscroll-3-54\nscroll-3-55\nscroll-3-56\nscroll-3-57\nscroll-3-58\nscroll-3-59\nscroll-3-60\nscroll-3-61\nscroll-3-62\nscroll-3-63\nscroll-3-64\nscroll-3-65\nscroll-3-66\nscroll-3-67\nscroll-3-68\nscroll-3-69\nscroll-3-70\nscroll-3-71\nscroll-3-72\nscroll-3-73\nscroll-3-74\nscroll-3-75\nscroll-3-76\nscroll-3-77\nscroll-3-78\nscroll-3-79\nscroll-3-80\nscroll-3-81\nscroll-3-82\nscroll-3-83\nscroll-3-84\nscroll-3-85\nscroll-3-86\nscroll-3-87\nscroll-3-88\nscroll-3-89\nscroll-3-90\nscroll-3-91\nscroll-3-92\nscroll-3-93\nscroll-3-94\nscroll-3-95\nscroll-3-96\nscroll-3-97\nscroll-3-98\nscroll-3-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-3-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
