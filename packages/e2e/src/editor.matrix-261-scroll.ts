import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-261-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-261.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-0-0\nscroll-0-1\nscroll-0-2\nscroll-0-3\nscroll-0-4\nscroll-0-5\nscroll-0-6\nscroll-0-7\nscroll-0-8\nscroll-0-9\nscroll-0-10\nscroll-0-11\nscroll-0-12\nscroll-0-13\nscroll-0-14\nscroll-0-15\nscroll-0-16\nscroll-0-17\nscroll-0-18\nscroll-0-19\nscroll-0-20\nscroll-0-21\nscroll-0-22\nscroll-0-23\nscroll-0-24\nscroll-0-25\nscroll-0-26\nscroll-0-27\nscroll-0-28\nscroll-0-29\nscroll-0-30\nscroll-0-31\nscroll-0-32\nscroll-0-33\nscroll-0-34\nscroll-0-35\nscroll-0-36\nscroll-0-37\nscroll-0-38\nscroll-0-39\nscroll-0-40\nscroll-0-41\nscroll-0-42\nscroll-0-43\nscroll-0-44\nscroll-0-45\nscroll-0-46\nscroll-0-47\nscroll-0-48\nscroll-0-49\nscroll-0-50\nscroll-0-51\nscroll-0-52\nscroll-0-53\nscroll-0-54\nscroll-0-55\nscroll-0-56\nscroll-0-57\nscroll-0-58\nscroll-0-59\nscroll-0-60\nscroll-0-61\nscroll-0-62\nscroll-0-63\nscroll-0-64\nscroll-0-65\nscroll-0-66\nscroll-0-67\nscroll-0-68\nscroll-0-69\nscroll-0-70\nscroll-0-71\nscroll-0-72\nscroll-0-73\nscroll-0-74\nscroll-0-75\nscroll-0-76\nscroll-0-77\nscroll-0-78\nscroll-0-79\nscroll-0-80\nscroll-0-81\nscroll-0-82\nscroll-0-83\nscroll-0-84\nscroll-0-85\nscroll-0-86\nscroll-0-87\nscroll-0-88\nscroll-0-89\nscroll-0-90\nscroll-0-91\nscroll-0-92\nscroll-0-93\nscroll-0-94\nscroll-0-95\nscroll-0-96\nscroll-0-97\nscroll-0-98\nscroll-0-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-0-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
