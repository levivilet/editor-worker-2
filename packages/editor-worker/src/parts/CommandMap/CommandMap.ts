import * as CloseFind from '../CloseFind/CloseFind.ts'
import * as Create from '../Create/Create.ts'
import * as DeleteCharacterLeft from '../DeleteCharacterLeft/DeleteCharacterLeft.ts'
import * as DeleteCharacterRight from '../DeleteCharacterRight/DeleteCharacterRight.ts'
import * as DeleteWordLeft from '../DeleteWordLeft/DeleteWordLeft.ts'
import * as DeleteWordRight from '../DeleteWordRight/DeleteWordRight.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as OpenFind from '../OpenFind/OpenFind.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as SetDiagnostics from '../SetDiagnostics/SetDiagnostics.ts'
import * as SetSelections2 from '../SetSelections2/SetSelections2.ts'
import * as TextDocumentCommands from '../TextDocumentCommands/TextDocumentCommands.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

const emptyArray = (): readonly never[] => []

const getCommandIds = (): readonly string[] => [
  'closeFind',
  'deleteCharacterLeft',
  'deleteCharacterRight',
  'deleteWordLeft',
  'deleteWordRight',
  'handleClick',
  'handleInput',
  'openFind',
  'openFind2',
  'updateDiagnostics',
]

const noop = (): undefined => undefined

export const commandMap = {
  'Editor.closeFind': CloseFind.closeFind,
  'Editor.create': Create.create,
  'Editor.create2': Create.create,
  'Editor.cursorDocumentEnd': TextDocumentCommands.cursorDocumentEnd,
  'Editor.cursorDocumentStart': TextDocumentCommands.cursorDocumentStart,
  'Editor.cursorDown': TextDocumentCommands.cursorDown,
  'Editor.cursorEnd': TextDocumentCommands.cursorEnd,
  'Editor.cursorHome': TextDocumentCommands.cursorHome,
  'Editor.cursorLeft': TextDocumentCommands.cursorLeft,
  'Editor.cursorRight': TextDocumentCommands.cursorRight,
  'Editor.cursorUp': TextDocumentCommands.cursorUp,
  'Editor.cursorWordLeft': TextDocumentCommands.cursorWordLeft,
  'Editor.cursorWordRight': TextDocumentCommands.cursorWordRight,
  'Editor.deleteAllLeft': TextDocumentCommands.deleteAllLeft,
  'Editor.deleteAllRight': TextDocumentCommands.deleteAllRight,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteCharacterRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordRight': DeleteWordRight.deleteWordRight,
  'Editor.diff2': Diff2.diff2,
  'Editor.dispose': Dispose.dispose,
  'Editor.getCommandIds': getCommandIds,
  'Editor.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Editor.getQuickPickMenuEntries': emptyArray,
  'Editor.handleClick': HandleClick.handleClick,
  'Editor.handleInput': HandleInput.handleInput,
  'Editor.insertLineBreak': TextDocumentCommands.insertLineBreak,
  'Editor.insertTab': TextDocumentCommands.insertTab,
  'Editor.loadContent': LoadContent.loadContent,
  'Editor.openFind': OpenFind.openFind,
  'Editor.openFind2': OpenFind.openFind,
  'Editor.pasteText': TextDocumentCommands.pasteText,
  'Editor.redo': TextDocumentCommands.redo,
  'Editor.render2': Render2.render2,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.selectAll': TextDocumentCommands.selectAll,
  'Editor.selectDown': TextDocumentCommands.selectDown,
  'Editor.selectEnd': TextDocumentCommands.selectEnd,
  'Editor.selectHome': TextDocumentCommands.selectHome,
  'Editor.selectLeft': TextDocumentCommands.selectLeft,
  'Editor.selectRight': TextDocumentCommands.selectRight,
  'Editor.selectUp': TextDocumentCommands.selectUp,
  'Editor.selectWordLeft': TextDocumentCommands.selectWordLeft,
  'Editor.selectWordRight': TextDocumentCommands.selectWordRight,
  'Editor.setDiagnostics': SetDiagnostics.setDiagnostics,
  'Editor.setSelections2': SetSelections2.setSelections2,
  'Editor.type': TextDocumentCommands.type,
  'Editor.undo': TextDocumentCommands.undo,
  'Editor.updateDiagnostics': noop,
  'FindWidget.close': CloseFind.closeFind,
  'Font.ensure': noop,
  'Initialize.initialize': noop,
  'TextDocumentWorker.setPort': TextDocumentWorker.setPort,
}
