import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-268-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-268.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-7-0\nscroll-7-1\nscroll-7-2\nscroll-7-3\nscroll-7-4\nscroll-7-5\nscroll-7-6\nscroll-7-7\nscroll-7-8\nscroll-7-9\nscroll-7-10\nscroll-7-11\nscroll-7-12\nscroll-7-13\nscroll-7-14\nscroll-7-15\nscroll-7-16\nscroll-7-17\nscroll-7-18\nscroll-7-19\nscroll-7-20\nscroll-7-21\nscroll-7-22\nscroll-7-23\nscroll-7-24\nscroll-7-25\nscroll-7-26\nscroll-7-27\nscroll-7-28\nscroll-7-29\nscroll-7-30\nscroll-7-31\nscroll-7-32\nscroll-7-33\nscroll-7-34\nscroll-7-35\nscroll-7-36\nscroll-7-37\nscroll-7-38\nscroll-7-39\nscroll-7-40\nscroll-7-41\nscroll-7-42\nscroll-7-43\nscroll-7-44\nscroll-7-45\nscroll-7-46\nscroll-7-47\nscroll-7-48\nscroll-7-49\nscroll-7-50\nscroll-7-51\nscroll-7-52\nscroll-7-53\nscroll-7-54\nscroll-7-55\nscroll-7-56\nscroll-7-57\nscroll-7-58\nscroll-7-59\nscroll-7-60\nscroll-7-61\nscroll-7-62\nscroll-7-63\nscroll-7-64\nscroll-7-65\nscroll-7-66\nscroll-7-67\nscroll-7-68\nscroll-7-69\nscroll-7-70\nscroll-7-71\nscroll-7-72\nscroll-7-73\nscroll-7-74\nscroll-7-75\nscroll-7-76\nscroll-7-77\nscroll-7-78\nscroll-7-79\nscroll-7-80\nscroll-7-81\nscroll-7-82\nscroll-7-83\nscroll-7-84\nscroll-7-85\nscroll-7-86\nscroll-7-87\nscroll-7-88\nscroll-7-89\nscroll-7-90\nscroll-7-91\nscroll-7-92\nscroll-7-93\nscroll-7-94\nscroll-7-95\nscroll-7-96\nscroll-7-97\nscroll-7-98\nscroll-7-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-7-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
