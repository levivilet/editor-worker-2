import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-265-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-265.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-4-0\nscroll-4-1\nscroll-4-2\nscroll-4-3\nscroll-4-4\nscroll-4-5\nscroll-4-6\nscroll-4-7\nscroll-4-8\nscroll-4-9\nscroll-4-10\nscroll-4-11\nscroll-4-12\nscroll-4-13\nscroll-4-14\nscroll-4-15\nscroll-4-16\nscroll-4-17\nscroll-4-18\nscroll-4-19\nscroll-4-20\nscroll-4-21\nscroll-4-22\nscroll-4-23\nscroll-4-24\nscroll-4-25\nscroll-4-26\nscroll-4-27\nscroll-4-28\nscroll-4-29\nscroll-4-30\nscroll-4-31\nscroll-4-32\nscroll-4-33\nscroll-4-34\nscroll-4-35\nscroll-4-36\nscroll-4-37\nscroll-4-38\nscroll-4-39\nscroll-4-40\nscroll-4-41\nscroll-4-42\nscroll-4-43\nscroll-4-44\nscroll-4-45\nscroll-4-46\nscroll-4-47\nscroll-4-48\nscroll-4-49\nscroll-4-50\nscroll-4-51\nscroll-4-52\nscroll-4-53\nscroll-4-54\nscroll-4-55\nscroll-4-56\nscroll-4-57\nscroll-4-58\nscroll-4-59\nscroll-4-60\nscroll-4-61\nscroll-4-62\nscroll-4-63\nscroll-4-64\nscroll-4-65\nscroll-4-66\nscroll-4-67\nscroll-4-68\nscroll-4-69\nscroll-4-70\nscroll-4-71\nscroll-4-72\nscroll-4-73\nscroll-4-74\nscroll-4-75\nscroll-4-76\nscroll-4-77\nscroll-4-78\nscroll-4-79\nscroll-4-80\nscroll-4-81\nscroll-4-82\nscroll-4-83\nscroll-4-84\nscroll-4-85\nscroll-4-86\nscroll-4-87\nscroll-4-88\nscroll-4-89\nscroll-4-90\nscroll-4-91\nscroll-4-92\nscroll-4-93\nscroll-4-94\nscroll-4-95\nscroll-4-96\nscroll-4-97\nscroll-4-98\nscroll-4-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-4-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
