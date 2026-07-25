import { afterEach, expect, test } from '@jest/globals'
import { ClipBoardWorker, FileSystemWorker, SyntaxHighlightingWorker, TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import { copy, cut, paste } from '../src/parts/Clipboard/Clipboard.ts'
import { create } from '../src/parts/Create/Create.ts'
import { dispose } from '../src/parts/Dispose/Dispose.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getSelections2 } from '../src/parts/GetSelections2/GetSelections2.ts'
import { getText } from '../src/parts/GetText/GetText.ts'
import { handleBeforeInput } from '../src/parts/HandleBeforeInput/HandleBeforeInput.ts'
import { handleInput } from '../src/parts/HandleInput/HandleInput.ts'
import { handleWheel } from '../src/parts/HandleWheel/HandleWheel.ts'
import { loadContent } from '../src/parts/LoadContent/LoadContent.ts'
import { pointerDown, pointerMove, pointerUp } from '../src/parts/PointerSelection/PointerSelection.ts'
import { resize } from '../src/parts/Resize/Resize.ts'
import { save } from '../src/parts/Save/Save.ts'
import * as TextDocumentWorker from '../src/parts/TextDocumentWorker/TextDocumentWorker.ts'
import { registerMockTextDocumentWorker } from './MockTextDocumentWorker.ts'

const testState = {
  currentId: 1000,
}

const registerSyntaxHighlighting = (): void => {
  SyntaxHighlightingWorker.set({
    dispose: async (): Promise<void> => {},
    invoke: async (_method: string, codeBlock: string): Promise<readonly (readonly string[])[]> => {
      return codeBlock.split('\n').map((line) => [line, 'Token Text'])
    },
  } as any)
}

const setup = async (content = 'hello world', height = 100): Promise<number> => {
  const uid = testState.currentId++
  registerMockTextDocumentWorker()
  registerSyntaxHighlighting()
  create(uid, 'file:///test.txt', 0, 0, 100, height)
  await handleInput(uid, content)
  return uid
}

afterEach(async () => {
  for (let uid = 1000; uid < testState.currentId; uid++) {
    try {
      dispose(uid)
    } catch {
      // Already disposed.
    }
  }
  TextDocumentWorker.reset()
  await SyntaxHighlightingWorker.dispose()
})

test('routes every supported beforeinput operation through the document worker', async () => {
  const uid = await setup('abc def')
  const operations: readonly (readonly [string, string | null])[] = [
    ['insertText', 'X'],
    ['insertReplacementText', 'Y'],
    ['insertLineBreak', null],
    ['insertParagraph', null],
    ['deleteContentBackward', null],
    ['deleteContentForward', null],
    ['deleteWordBackward', null],
    ['deleteWordForward', null],
    ['deleteSoftLineBackward', null],
    ['deleteSoftLineForward', null],
    ['deleteHardLineBackward', null],
    ['deleteHardLineForward', null],
    ['historyUndo', null],
    ['historyRedo', null],
    ['unknown', null],
  ]
  for (const [inputType, data] of operations) {
    await handleBeforeInput(uid, inputType, data)
  }

  expect(await getText(uid)).toEqual(expect.any(String))
  expect(getSelections2(uid)).toHaveLength(4)
})

test('copies, cuts, and pastes through the clipboard worker', async () => {
  const uid = await setup('hello world')
  const writes: string[] = []
  let clipboardText = 'editor'
  using _clipboardRpc = ClipBoardWorker.registerMockRpc({
    'ClipBoard.readText': async (): Promise<string> => clipboardText,
    'ClipBoard.writeText': async (text: string): Promise<void> => {
      writes.push(text)
      clipboardText = text
    },
  })
  const rpc = await TextDocumentWorker.get()
  await rpc.invoke('TextDocument.setSelections', uid, [0, 6, 0, 11])

  await copy(uid)
  expect(writes).toEqual(['world'])
  await cut(uid)
  expect(await getText(uid)).toBe('hello ')
  clipboardText = 'editor'
  await paste(uid)
  expect(await getText(uid)).toBe('hello editor')
})

test('saves the exact document version and preserves content on failure', async () => {
  const uid = await setup('before text')
  await handleBeforeInput(uid, 'insertText', 'after ')
  const writes: unknown[][] = []
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.writeFile': async (...params: readonly unknown[]): Promise<void> => {
      writes.push([...params])
    },
  })

  await save(uid)
  expect(writes).toEqual([['file:///test.txt', 'after before text']])
  expect(EditorStates.get(uid).modified).toBe(false)

  await handleBeforeInput(uid, 'insertText', '!')
  using _failedFileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.writeFile': async (): Promise<void> => {
      throw new Error('disk full')
    },
  })
  await save(uid)
  expect(EditorStates.get(uid).errorMessage).toContain('disk full')
  expect(await getText(uid)).toBe('after !before text')
})

test('scrolls in pixel, line, and page modes and resizes the viewport', async () => {
  const uid = await setup(Array.from({ length: 100 }, (_, index) => `${index}-${'x'.repeat(30)}`).join('\n'), 40)

  await handleWheel(uid, 0, 20, 20)
  expect(EditorStates.get(uid)).toMatchObject({ scrollLeft: 20, scrollTop: 20 })
  await handleWheel(uid, 1, -1, 2)
  expect(EditorStates.get(uid).scrollTop).toBe(60)
  await handleWheel(uid, 2, 0, 1)
  expect(EditorStates.get(uid).scrollTop).toBe(100)
  await handleWheel(uid, 0, -1000, -1000)
  expect(EditorStates.get(uid)).toMatchObject({ scrollLeft: 0, scrollTop: 0 })

  await resize(uid, { height: 60, width: 200, x: 10, y: 20 })
  expect(EditorStates.get(uid)).toMatchObject({ height: 60, width: 200, x: 10, y: 20 })
  await resize(uid, {})
  expect(EditorStates.get(uid)).toMatchObject({ height: 60, width: 200 })
})

test('creates and extends a pointer selection while dragging', async () => {
  const uid = await setup('first line\nsecond line')
  using _measurementRpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getPosition': (): number => 3,
  })

  await pointerDown(uid, 10, 5)
  expect(EditorStates.get(uid).pointerSelecting).toBe(true)
  await pointerMove(uid, 20, 25, 0)
  expect(getSelections2(uid)).toEqual([0, 3, 0, 3])
  await pointerMove(uid, 20, 25, 1)
  expect(getSelections2(uid)).toEqual([0, 3, 1, 3])
  await pointerUp(uid, 20, 25)
  expect(EditorStates.get(uid).pointerSelecting).toBe(false)
})

test('surfaces load failures in editor state', async () => {
  const uid = testState.currentId++
  registerMockTextDocumentWorker()
  create(uid, 'file:///missing.txt')
  using _fileSystemRpc = FileSystemWorker.registerMockRpc({
    'FileSystem.getFileHash': async (): Promise<string> => {
      throw new Error('not found')
    },
    'FileSystem.readFile': async (): Promise<string> => {
      throw new Error('not found')
    },
  })

  await loadContent(uid)

  expect(EditorStates.get(uid).errorMessage).toContain('not found')
})
