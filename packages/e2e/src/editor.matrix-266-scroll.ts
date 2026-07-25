import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-266-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-266.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-5-0\nscroll-5-1\nscroll-5-2\nscroll-5-3\nscroll-5-4\nscroll-5-5\nscroll-5-6\nscroll-5-7\nscroll-5-8\nscroll-5-9\nscroll-5-10\nscroll-5-11\nscroll-5-12\nscroll-5-13\nscroll-5-14\nscroll-5-15\nscroll-5-16\nscroll-5-17\nscroll-5-18\nscroll-5-19\nscroll-5-20\nscroll-5-21\nscroll-5-22\nscroll-5-23\nscroll-5-24\nscroll-5-25\nscroll-5-26\nscroll-5-27\nscroll-5-28\nscroll-5-29\nscroll-5-30\nscroll-5-31\nscroll-5-32\nscroll-5-33\nscroll-5-34\nscroll-5-35\nscroll-5-36\nscroll-5-37\nscroll-5-38\nscroll-5-39\nscroll-5-40\nscroll-5-41\nscroll-5-42\nscroll-5-43\nscroll-5-44\nscroll-5-45\nscroll-5-46\nscroll-5-47\nscroll-5-48\nscroll-5-49\nscroll-5-50\nscroll-5-51\nscroll-5-52\nscroll-5-53\nscroll-5-54\nscroll-5-55\nscroll-5-56\nscroll-5-57\nscroll-5-58\nscroll-5-59\nscroll-5-60\nscroll-5-61\nscroll-5-62\nscroll-5-63\nscroll-5-64\nscroll-5-65\nscroll-5-66\nscroll-5-67\nscroll-5-68\nscroll-5-69\nscroll-5-70\nscroll-5-71\nscroll-5-72\nscroll-5-73\nscroll-5-74\nscroll-5-75\nscroll-5-76\nscroll-5-77\nscroll-5-78\nscroll-5-79\nscroll-5-80\nscroll-5-81\nscroll-5-82\nscroll-5-83\nscroll-5-84\nscroll-5-85\nscroll-5-86\nscroll-5-87\nscroll-5-88\nscroll-5-89\nscroll-5-90\nscroll-5-91\nscroll-5-92\nscroll-5-93\nscroll-5-94\nscroll-5-95\nscroll-5-96\nscroll-5-97\nscroll-5-98\nscroll-5-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-5-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
