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
  'Editor.loadContent': LoadContent.loadContent,
  'Editor.openFind': OpenFind.openFind,
  'Editor.openFind2': OpenFind.openFind,
  'Editor.render2': Render2.render2,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.setDiagnostics': SetDiagnostics.setDiagnostics,
  'Editor.setSelections2': SetSelections2.setSelections2,
  'Editor.updateDiagnostics': noop,
  'FindWidget.close': CloseFind.closeFind,
  'Font.ensure': noop,
  'Initialize.initialize': noop,
  'TextDocumentWorker.setPort': TextDocumentWorker.setPort,
}
