import * as ApplyDocumentEdits from '../ApplyDocumentEdits/ApplyDocumentEdits.ts'
import * as Clipboard from '../Clipboard/Clipboard.ts'
import * as CloseFind from '../CloseFind/CloseFind.ts'
import * as Create from '../Create/Create.ts'
import * as DeleteCharacterLeft from '../DeleteCharacterLeft/DeleteCharacterLeft.ts'
import * as DeleteCharacterRight from '../DeleteCharacterRight/DeleteCharacterRight.ts'
import * as DeleteWordLeft from '../DeleteWordLeft/DeleteWordLeft.ts'
import * as DeleteWordRight from '../DeleteWordRight/DeleteWordRight.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as FindWidgetCommands from '../FindWidgetCommands/FindWidgetCommands.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as GetLines2 from '../GetLines2/GetLines2.ts'
import * as GetSelections2 from '../GetSelections2/GetSelections2.ts'
import * as GetText from '../GetText/GetText.ts'
import * as HandleBeforeInput from '../HandleBeforeInput/HandleBeforeInput.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'
import * as LegacyBasicCommands from '../LegacyBasicCommands/LegacyBasicCommands.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as OpenFind from '../OpenFind/OpenFind.ts'
import * as PointerSelection from '../PointerSelection/PointerSelection.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as Resize from '../Resize/Resize.ts'
import * as Save from '../Save/Save.ts'
import * as SetDiagnostics from '../SetDiagnostics/SetDiagnostics.ts'
import * as SetSelections2 from '../SetSelections2/SetSelections2.ts'
import * as TextDocumentCommands from '../TextDocumentCommands/TextDocumentCommands.ts'
import * as TextDocumentWorker from '../TextDocumentWorker/TextDocumentWorker.ts'

const emptyArray = (): readonly never[] => []

const getCommandIds = (): readonly string[] => [
  'cancelSelection',
  'closeFind',
  'copy',
  'cursorCharacterLeft',
  'cursorCharacterRight',
  'cursorDocumentEnd',
  'cursorDocumentStart',
  'cursorDown',
  'cursorEnd',
  'cursorHome',
  'cursorLeft',
  'cursorRight',
  'cursorSet',
  'cursorUp',
  'cursorWordLeft',
  'cursorWordRight',
  'cut',
  'deleteAll',
  'deleteAllLeft',
  'deleteAllRight',
  'deleteCharacterLeft',
  'deleteCharacterRight',
  'deleteLine',
  'deleteWordLeft',
  'deleteWordRight',
  'executeWidgetCommand',
  'getSelections',
  'getSelections2',
  'getText',
  'handleBeforeInput',
  'handleClick',
  'handleInput',
  'handleTab',
  'handleWheel',
  'indent',
  'indentLess',
  'indentMore',
  'insertLineBreak',
  'insertTab',
  'openFind',
  'openFind2',
  'paste',
  'pasteText',
  'pointerDown',
  'pointerMove',
  'pointerUp',
  'redo',
  'resize',
  'save',
  'selectAll',
  'selectAllLeft',
  'selectAllRight',
  'selectCharacterLeft',
  'selectCharacterRight',
  'selectDocumentEnd',
  'selectDocumentStart',
  'selectDown',
  'selectEnd',
  'selectHome',
  'selectLeft',
  'selectRight',
  'selectUp',
  'selectWordLeft',
  'selectWordRight',
  'setSelections',
  'setSelections2',
  'setText',
  'type',
  'undo',
  'unIndent',
  'unindent',
  'updateDiagnostics',
]

const noop = (): undefined => undefined

export const commandMap = {
  'Editor.applyDocumentEdits': ApplyDocumentEdits.applyDocumentEdits,
  'Editor.cancelSelection': LegacyBasicCommands.cancelSelection,
  'Editor.closeFind': CloseFind.closeFind,
  'Editor.copy': Clipboard.copy,
  'Editor.create': Create.create,
  'Editor.create2': Create.create,
  'Editor.cursorCharacterLeft': TextDocumentCommands.cursorLeft,
  'Editor.cursorCharacterRight': TextDocumentCommands.cursorRight,
  'Editor.cursorDocumentEnd': TextDocumentCommands.cursorDocumentEnd,
  'Editor.cursorDocumentStart': TextDocumentCommands.cursorDocumentStart,
  'Editor.cursorDown': TextDocumentCommands.cursorDown,
  'Editor.cursorEnd': TextDocumentCommands.cursorEnd,
  'Editor.cursorHome': TextDocumentCommands.cursorHome,
  'Editor.cursorLeft': TextDocumentCommands.cursorLeft,
  'Editor.cursorRight': TextDocumentCommands.cursorRight,
  'Editor.cursorSet': LegacyBasicCommands.cursorSet,
  'Editor.cursorUp': TextDocumentCommands.cursorUp,
  'Editor.cursorWordLeft': TextDocumentCommands.cursorWordLeft,
  'Editor.cursorWordRight': TextDocumentCommands.cursorWordRight,
  'Editor.cut': Clipboard.cut,
  'Editor.deleteAll': LegacyBasicCommands.deleteAll,
  'Editor.deleteAllLeft': TextDocumentCommands.deleteAllLeft,
  'Editor.deleteAllRight': TextDocumentCommands.deleteAllRight,
  'Editor.deleteCharacterLeft': DeleteCharacterLeft.deleteCharacterLeft,
  'Editor.deleteCharacterRight': DeleteCharacterRight.deleteCharacterRight,
  'Editor.deleteLine': TextDocumentCommands.deleteLine,
  'Editor.deleteWordLeft': DeleteWordLeft.deleteWordLeft,
  'Editor.deleteWordRight': DeleteWordRight.deleteWordRight,
  'Editor.diff2': Diff2.diff2,
  'Editor.dispose': Dispose.disposeAsync,
  'Editor.executeWidgetCommand': FindWidgetCommands.executeWidgetCommand,
  'Editor.getCommandIds': getCommandIds,
  'Editor.getKeyBindings': GetKeyBindings.getKeyBindings,
  'Editor.getLines2': GetLines2.getLines2,
  'Editor.getQuickPickMenuEntries': emptyArray,
  'Editor.getSelections': LegacyBasicCommands.getSelections,
  'Editor.getSelections2': GetSelections2.getSelections2,
  'Editor.getText': GetText.getText,
  'Editor.handleBeforeInput': HandleBeforeInput.handleBeforeInput,
  'Editor.handleClick': HandleClick.handleClick,
  'Editor.handleInput': HandleInput.handleInput,
  'Editor.handleTab': TextDocumentCommands.insertTab,
  'Editor.handleWheel': HandleWheel.handleWheel,
  'Editor.indent': TextDocumentCommands.indent,
  'Editor.indentLess': TextDocumentCommands.unindent,
  'Editor.indentMore': TextDocumentCommands.indent,
  'Editor.insertLineBreak': TextDocumentCommands.insertLineBreak,
  'Editor.insertTab': TextDocumentCommands.insertTab,
  'Editor.loadContent': LoadContent.loadContent,
  'Editor.openFind': OpenFind.openFind,
  'Editor.openFind2': OpenFind.openFind,
  'Editor.paste': Clipboard.paste,
  'Editor.pasteText': TextDocumentCommands.pasteText,
  'Editor.pointerDown': PointerSelection.pointerDown,
  'Editor.pointerMove': PointerSelection.pointerMove,
  'Editor.pointerUp': PointerSelection.pointerUp,
  'Editor.redo': TextDocumentCommands.redo,
  'Editor.render2': Render2.render2,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.requestFindWidgetClose': CloseFind.requestFindWidgetClose,
  'Editor.resize': Resize.resize,
  'Editor.save': Save.save,
  'Editor.selectAll': TextDocumentCommands.selectAll,
  'Editor.selectAllLeft': TextDocumentCommands.selectHome,
  'Editor.selectAllRight': TextDocumentCommands.selectEnd,
  'Editor.selectCharacterLeft': TextDocumentCommands.selectLeft,
  'Editor.selectCharacterRight': TextDocumentCommands.selectRight,
  'Editor.selectDocumentEnd': TextDocumentCommands.selectDocumentEnd,
  'Editor.selectDocumentStart': TextDocumentCommands.selectDocumentStart,
  'Editor.selectDown': TextDocumentCommands.selectDown,
  'Editor.selectEnd': TextDocumentCommands.selectEnd,
  'Editor.selectHome': TextDocumentCommands.selectHome,
  'Editor.selectLeft': TextDocumentCommands.selectLeft,
  'Editor.selectRight': TextDocumentCommands.selectRight,
  'Editor.selectUp': TextDocumentCommands.selectUp,
  'Editor.selectWordLeft': TextDocumentCommands.selectWordLeft,
  'Editor.selectWordRight': TextDocumentCommands.selectWordRight,
  'Editor.setDiagnostics': SetDiagnostics.setDiagnostics,
  'Editor.setSelections': LegacyBasicCommands.setSelections,
  'Editor.setSelections2': SetSelections2.setSelections2,
  'Editor.setText': LegacyBasicCommands.setText,
  'Editor.type': TextDocumentCommands.type,
  'Editor.undo': TextDocumentCommands.undo,
  'Editor.unindent': TextDocumentCommands.unindent,
  'Editor.unIndent': TextDocumentCommands.unindent,
  'Editor.updateDiagnostics': noop,
  ...FindWidgetCommands.commandMap,
  'Font.ensure': noop,
  'Initialize.initialize': noop,
  'TextDocumentWorker.setPort': TextDocumentWorker.setPort,
}
