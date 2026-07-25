import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as Render2 from '../Render2/Render2.ts'

export const commandMap = {
  'Editor.create': Create.create,
  'Editor.diff2': Diff2.diff2,
  'Editor.dispose': Dispose.dispose,
  'Editor.render2': Render2.render2,
}
