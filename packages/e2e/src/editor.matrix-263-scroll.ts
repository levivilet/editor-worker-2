import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-263-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-263.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-2-0\nscroll-2-1\nscroll-2-2\nscroll-2-3\nscroll-2-4\nscroll-2-5\nscroll-2-6\nscroll-2-7\nscroll-2-8\nscroll-2-9\nscroll-2-10\nscroll-2-11\nscroll-2-12\nscroll-2-13\nscroll-2-14\nscroll-2-15\nscroll-2-16\nscroll-2-17\nscroll-2-18\nscroll-2-19\nscroll-2-20\nscroll-2-21\nscroll-2-22\nscroll-2-23\nscroll-2-24\nscroll-2-25\nscroll-2-26\nscroll-2-27\nscroll-2-28\nscroll-2-29\nscroll-2-30\nscroll-2-31\nscroll-2-32\nscroll-2-33\nscroll-2-34\nscroll-2-35\nscroll-2-36\nscroll-2-37\nscroll-2-38\nscroll-2-39\nscroll-2-40\nscroll-2-41\nscroll-2-42\nscroll-2-43\nscroll-2-44\nscroll-2-45\nscroll-2-46\nscroll-2-47\nscroll-2-48\nscroll-2-49\nscroll-2-50\nscroll-2-51\nscroll-2-52\nscroll-2-53\nscroll-2-54\nscroll-2-55\nscroll-2-56\nscroll-2-57\nscroll-2-58\nscroll-2-59\nscroll-2-60\nscroll-2-61\nscroll-2-62\nscroll-2-63\nscroll-2-64\nscroll-2-65\nscroll-2-66\nscroll-2-67\nscroll-2-68\nscroll-2-69\nscroll-2-70\nscroll-2-71\nscroll-2-72\nscroll-2-73\nscroll-2-74\nscroll-2-75\nscroll-2-76\nscroll-2-77\nscroll-2-78\nscroll-2-79\nscroll-2-80\nscroll-2-81\nscroll-2-82\nscroll-2-83\nscroll-2-84\nscroll-2-85\nscroll-2-86\nscroll-2-87\nscroll-2-88\nscroll-2-89\nscroll-2-90\nscroll-2-91\nscroll-2-92\nscroll-2-93\nscroll-2-94\nscroll-2-95\nscroll-2-96\nscroll-2-97\nscroll-2-98\nscroll-2-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-2-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
