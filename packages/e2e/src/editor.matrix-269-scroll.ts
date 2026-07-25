import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-269-scroll'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/matrix-269.txt`
  await FileSystem.writeFile(
    filePath,
    'scroll-8-0\nscroll-8-1\nscroll-8-2\nscroll-8-3\nscroll-8-4\nscroll-8-5\nscroll-8-6\nscroll-8-7\nscroll-8-8\nscroll-8-9\nscroll-8-10\nscroll-8-11\nscroll-8-12\nscroll-8-13\nscroll-8-14\nscroll-8-15\nscroll-8-16\nscroll-8-17\nscroll-8-18\nscroll-8-19\nscroll-8-20\nscroll-8-21\nscroll-8-22\nscroll-8-23\nscroll-8-24\nscroll-8-25\nscroll-8-26\nscroll-8-27\nscroll-8-28\nscroll-8-29\nscroll-8-30\nscroll-8-31\nscroll-8-32\nscroll-8-33\nscroll-8-34\nscroll-8-35\nscroll-8-36\nscroll-8-37\nscroll-8-38\nscroll-8-39\nscroll-8-40\nscroll-8-41\nscroll-8-42\nscroll-8-43\nscroll-8-44\nscroll-8-45\nscroll-8-46\nscroll-8-47\nscroll-8-48\nscroll-8-49\nscroll-8-50\nscroll-8-51\nscroll-8-52\nscroll-8-53\nscroll-8-54\nscroll-8-55\nscroll-8-56\nscroll-8-57\nscroll-8-58\nscroll-8-59\nscroll-8-60\nscroll-8-61\nscroll-8-62\nscroll-8-63\nscroll-8-64\nscroll-8-65\nscroll-8-66\nscroll-8-67\nscroll-8-68\nscroll-8-69\nscroll-8-70\nscroll-8-71\nscroll-8-72\nscroll-8-73\nscroll-8-74\nscroll-8-75\nscroll-8-76\nscroll-8-77\nscroll-8-78\nscroll-8-79\nscroll-8-80\nscroll-8-81\nscroll-8-82\nscroll-8-83\nscroll-8-84\nscroll-8-85\nscroll-8-86\nscroll-8-87\nscroll-8-88\nscroll-8-89\nscroll-8-90\nscroll-8-91\nscroll-8-92\nscroll-8-93\nscroll-8-94\nscroll-8-95\nscroll-8-96\nscroll-8-97\nscroll-8-98\nscroll-8-99',
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  await Command.execute('Editor.setSelections2', new Uint32Array([0, 0, 0, 0]))
  await Command.execute('Editor.handleWheel', 0, 0, 400)
  await Command.execute('Editor.updateDiagnostics')

  const lines = Locator('.EditorLine')
  await expect(lines).toHaveCount(53)
  const firstLine = lines.nth(0)
  await expect(firstLine).toHaveText('scroll-8-10')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', '0')
  await expect(cursor).toHaveAttribute('data-column-index', '0')
}
