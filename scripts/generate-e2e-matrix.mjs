import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises'

const outputDirectory = new URL('../packages/e2e/src/', import.meta.url)
const scenarios = []

const add = (category, initial, selection, commands, expectedLines, expectedCursor, clipboardText = '', useClipboard = clipboardText !== '') => {
  scenarios.push({ category, clipboardText, commands, expectedCursor, expectedLines, initial, selection, useClipboard })
}

for (let index = 0; index < 10; index++) {
  const base = `base-${index}`
  add('type-prefix', base, [0, 0, 0, 0], [['Editor.type', `p${index}`]], [`p${index}${base}`], [0, 2])
  add('type-middle', base, [0, 2, 0, 2], [['Editor.type', `m${index}`]], [`ba m${index}${base.slice(2)}`.replace('ba ', 'ba')], [0, 4])
  add('type-replace', base, [0, 1, 0, 4], [['Editor.type', `r${index}`]], [`b r${index}${base.slice(4)}`.replace('b ', 'b')], [0, 3])
  add('type-multiline', base, [0, 4, 0, 4], [['Editor.type', ' extra\nline']], ['base extra', `line-${index}`], [1, 4])
  add('type-unicode', base, [0, base.length, 0, base.length], [['Editor.type', `👮${index}`]], [`${base}👮${index}`], [0, base.length + 3])
}

for (let index = 1; index <= 10; index++) {
  const line = 'x'.repeat(index + 2)
  add('cursor-right', line, [0, index, 0, index], [['Editor.cursorCharacterRight']], [line], [0, index + 1])
  add('cursor-left', line, [0, index, 0, index], [['Editor.cursorCharacterLeft']], [line], [0, index - 1])
  add('cursor-down', `${line}\n${line}`, [0, index, 0, index], [['Editor.cursorDown']], [line, line], [1, index])
  add('cursor-up', `${line}\n${line}`, [1, index, 1, index], [['Editor.cursorUp']], [line, line], [0, index])
  if (index <= 5) {
    add('cursor-end', line, [0, index, 0, index], [['Editor.cursorEnd']], [line], [0, line.length])
    add('cursor-home', line, [0, index, 0, index], [['Editor.cursorHome']], [line], [0, 0])
  }
}

for (let index = 1; index <= 10; index++) {
  const line = `${'a'.repeat(index)} beta`
  add('select-right', line, [0, index - 1, 0, index - 1], [['Editor.selectCharacterRight']], [line], [0, index])
  add('select-left', line, [0, index, 0, index], [['Editor.selectCharacterLeft']], [line], [0, index - 1])
  add('select-down', `${line}\n${line}`, [0, index, 0, index], [['Editor.selectDown']], [line, line], [1, index])
  add('select-up', `${line}\n${line}`, [1, index, 1, index], [['Editor.selectUp']], [line, line], [0, index])
  add('select-word-right', line, [0, 0, 0, 0], [['Editor.selectWordRight']], [line], [0, index])
}

for (let index = 1; index <= 10; index++) {
  const prefix = '-'.repeat(index)
  add('delete-left', `${prefix}z`, [0, index, 0, index], [['Editor.deleteCharacterLeft']], [`${prefix.slice(0, -1)}z`], [0, index - 1])
  add('delete-right', `${prefix}z`, [0, index, 0, index], [['Editor.deleteCharacterRight']], [prefix], [0, index])
  add('delete-word-left', `${prefix}alpha`, [0, index + 5, 0, index + 5], [['Editor.deleteWordLeft']], [prefix], [0, index])
  add('delete-word-right', `alpha${prefix}`, [0, 0, 0, 0], [['Editor.deleteWordRight']], [prefix], [0, 0])
  add('delete-selection', `${prefix}one word`, [0, index, 0, index + 4], [['Editor.deleteCharacterLeft']], [`${prefix}word`], [0, index])
}

for (let index = 0; index < 15; index++) {
  const initial = `undo-${index}`
  add('undo', initial, [0, initial.length, 0, initial.length], [['Editor.type', '!'], ['Editor.undo']], [initial], [0, initial.length])
}
for (let index = 0; index < 10; index++) {
  const initial = `redo-${index}`
  add(
    'redo',
    initial,
    [0, initial.length, 0, initial.length],
    [['Editor.type', '!'], ['Editor.undo'], ['Editor.redo']],
    [`${initial}!`],
    [0, initial.length + 1],
  )
}

for (let index = 0; index < 25; index++) {
  if (index % 3 === 0) {
    const initial = `copy source ${index}`
    add(
      'clipboard-copy',
      initial,
      [0, 0, 0, 4],
      [['Editor.copy'], ['Editor.cursorSet', 0, initial.length], ['Editor.paste']],
      [`${initial}copy`],
      [0, initial.length + 4],
      '',
      true,
    )
  } else if (index % 3 === 1) {
    const initial = `cut source ${index}`
    add('clipboard-cut', initial, [0, 0, 0, 3], [['Editor.cut'], ['Editor.paste']], [initial], [0, 3], '', true)
  } else {
    const initial = `clip-${index}`
    const clipboardText = index % 5 === 0 ? `p${index}\nq${index}` : `paste-${index}`
    const expectedLines = clipboardText.includes('\n')
      ? [`${initial}${clipboardText.split('\n')[0]}`, clipboardText.split('\n')[1]]
      : [`${initial}${clipboardText}`]
    const expectedCursor = clipboardText.includes('\n') ? [1, clipboardText.split('\n')[1].length] : [0, initial.length + clipboardText.length]
    add('clipboard-paste', initial, [0, initial.length, 0, initial.length], [['Editor.paste']], expectedLines, expectedCursor, clipboardText)
  }
}

for (let index = 0; index < 10; index++) {
  const lines = [`load-${index}`, `second-${index}`, `third-${index}`]
  add('load-crlf', lines.join('\r\n'), [0, 0, 0, 0], [], lines, [0, 0])
}

for (let index = 0; index < 10; index++) {
  const lines = Array.from({ length: 100 }, (_, lineIndex) => `scroll-${index}-${lineIndex}`)
  add('scroll', lines.join('\n'), [0, 0, 0, 0], [['Editor.handleWheel', 0, 0, 400]], [], [0, 0])
}

const render = (scenario, index) => {
  const id = String(index + 1).padStart(3, '0')
  const commandLines = scenario.commands
    .map(([command, ...args]) => `  await Command.execute(${[command, ...args].map((value) => JSON.stringify(value)).join(', ')})`)
    .join('\n')
  const expectedLineAssertions = scenario.expectedLines
    .map(
      (line, lineIndex) => `  const line${lineIndex} = lines.nth(${lineIndex})\n  await expect(line${lineIndex}).toHaveText(${JSON.stringify(line)})`,
    )
    .join('\n')
  const testParameters = scenario.useClipboard
    ? '{ ClipBoard, Command, expect, FileSystem, Locator, Main, Workspace }'
    : '{ Command, expect, FileSystem, Locator, Main, Workspace }'
  const clipboardSetup = scenario.useClipboard
    ? `  await ClipBoard.enableMemoryClipBoard()\n${
        scenario.clipboardText ? `  await ClipBoard.writeText(${JSON.stringify(scenario.clipboardText)})\n` : ''
      }`
    : ''
  const lineAssertions =
    scenario.category === 'scroll'
      ? `  const lines = Locator('.EditorLine')\n  await expect(lines).toHaveCount(53)\n  const firstLine = lines.nth(0)\n  await expect(firstLine).toHaveText(${JSON.stringify(`scroll-${index - 260}-10`)})`
      : `  const lines = Locator('.EditorLine')\n  await expect(lines).toHaveCount(${scenario.expectedLines.length})\n${expectedLineAssertions}`
  const savedAssertion = scenario.savedText
    ? `\n  const savedText = await FileSystem.readFile(filePath)\n  if (savedText !== ${JSON.stringify(scenario.savedText)}) {\n    throw new Error(\`Expected saved text ${JSON.stringify(scenario.savedText)} but received \${savedText}\`)\n  }`
    : ''
  return `import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.matrix-${id}-${scenario.category}'

export const test: Test = async (${testParameters}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = \`\${tmpDir}/matrix-${id}.txt\`
  await FileSystem.writeFile(filePath, ${JSON.stringify(scenario.initial)})
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
${clipboardSetup}  await Command.execute('Editor.setSelections2', new Uint32Array(${JSON.stringify(scenario.selection)}))
${commandLines}
  await Command.execute('Editor.updateDiagnostics')

${lineAssertions}
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveAttribute('data-row-index', ${JSON.stringify(String(scenario.expectedCursor[0]))})
  await expect(cursor).toHaveAttribute('data-column-index', ${JSON.stringify(String(scenario.expectedCursor[1]))})
${savedAssertion}
}
`
}

for (let index = 0; index < 10; index++) {
  const initial = `save-${index}`
  const suffix = `-updated-${index}`
  scenarios.push({
    category: 'save',
    clipboardText: '',
    commands: [['Editor.type', suffix], ['Editor.save']],
    expectedCursor: [0, initial.length + suffix.length],
    expectedLines: [`${initial}${suffix}`],
    initial,
    savedText: `${initial}${suffix}`,
    selection: [0, initial.length, 0, initial.length],
    useClipboard: false,
  })
}

await mkdir(outputDirectory, { recursive: true })
const previousMatrixFiles = (await readdir(outputDirectory)).filter((fileName) => /^editor\.matrix-\d{3}-.+\.ts$/u.test(fileName))
await Promise.all(previousMatrixFiles.map((fileName) => unlink(new URL(fileName, outputDirectory))))
await Promise.all(
  scenarios.map((scenario, index) => {
    const id = String(index + 1).padStart(3, '0')
    return writeFile(new URL(`editor.matrix-${id}-${scenario.category}.ts`, outputDirectory), render(scenario, index))
  }),
)

console.log(`Generated ${scenarios.length} editor E2E scenarios`)
