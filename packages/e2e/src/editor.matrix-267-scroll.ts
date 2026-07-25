import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-267-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-267.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-6-0\nscroll-6-1\nscroll-6-2\nscroll-6-3\nscroll-6-4\nscroll-6-5\nscroll-6-6\nscroll-6-7\nscroll-6-8\nscroll-6-9\nscroll-6-10\nscroll-6-11\nscroll-6-12\nscroll-6-13\nscroll-6-14\nscroll-6-15\nscroll-6-16\nscroll-6-17\nscroll-6-18\nscroll-6-19\nscroll-6-20\nscroll-6-21\nscroll-6-22\nscroll-6-23\nscroll-6-24\nscroll-6-25\nscroll-6-26\nscroll-6-27\nscroll-6-28\nscroll-6-29\nscroll-6-30\nscroll-6-31\nscroll-6-32\nscroll-6-33\nscroll-6-34\nscroll-6-35\nscroll-6-36\nscroll-6-37\nscroll-6-38\nscroll-6-39\nscroll-6-40\nscroll-6-41\nscroll-6-42\nscroll-6-43\nscroll-6-44\nscroll-6-45\nscroll-6-46\nscroll-6-47\nscroll-6-48\nscroll-6-49\nscroll-6-50\nscroll-6-51\nscroll-6-52\nscroll-6-53\nscroll-6-54\nscroll-6-55\nscroll-6-56\nscroll-6-57\nscroll-6-58\nscroll-6-59\nscroll-6-60\nscroll-6-61\nscroll-6-62\nscroll-6-63\nscroll-6-64\nscroll-6-65\nscroll-6-66\nscroll-6-67\nscroll-6-68\nscroll-6-69\nscroll-6-70\nscroll-6-71\nscroll-6-72\nscroll-6-73\nscroll-6-74\nscroll-6-75\nscroll-6-76\nscroll-6-77\nscroll-6-78\nscroll-6-79\nscroll-6-80\nscroll-6-81\nscroll-6-82\nscroll-6-83\nscroll-6-84\nscroll-6-85\nscroll-6-86\nscroll-6-87\nscroll-6-88\nscroll-6-89\nscroll-6-90\nscroll-6-91\nscroll-6-92\nscroll-6-93\nscroll-6-94\nscroll-6-95\nscroll-6-96\nscroll-6-97\nscroll-6-98\nscroll-6-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-6-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
