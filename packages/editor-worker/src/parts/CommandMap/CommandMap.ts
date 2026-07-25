import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as SetDiagnostics from '../SetDiagnostics/SetDiagnostics.ts'

const emptyArray = (): readonly never[] => []

const getCommandIds = (): readonly string[] => ['handleInput', 'updateDiagnostics']

const noop = (): undefined => undefined

export const commandMap = {
  'Editor.create': Create.create,
  'Editor.create2': Create.create,
  'Editor.diff2': Diff2.diff2,
  'Editor.dispose': Dispose.dispose,
  'Editor.getCommandIds': getCommandIds,
  'Editor.getKeyBindings': emptyArray,
  'Editor.getQuickPickMenuEntries': emptyArray,
  'Editor.handleInput': HandleInput.handleInput,
  'Editor.loadContent': LoadContent.loadContent,
  'Editor.render2': Render2.render2,
  'Editor.renderEventListeners': RenderEventListeners.renderEventListeners,
  'Editor.setDiagnostics': SetDiagnostics.setDiagnostics,
  'Editor.setSelections2': noop,
  'Editor.updateDiagnostics': noop,
  'Font.ensure': noop,
  'Initialize.initialize': noop,
}
