import * as WrapCommand from '../AboutStates/AboutStates.ts'
import * as Create from '../Create/Create.ts'
import * as Diff2 from '../Diff2/Diff2.ts'
import * as Dispose from '../Dispose/Dispose.ts'
import * as FocusNext from '../FocusNext/FocusNext.ts'
import * as FocusPrevious from '../FocusPrevious/FocusPrevious.ts'
import * as GetKeyBindings from '../GetKeyBindings/GetKeyBindings.ts'
import * as HandleClickButton from '../HandleClickButton/HandleClickButton.ts'
import * as HandleClickClose from '../HandleClickClose/HandleClickClose.ts'
import * as HandleClickCopy from '../HandleClickCopy/HandleClickCopy.ts'
import * as HandleClickOk from '../HandleClickOk/HandleClickOk.ts'
import * as HandleFocusIn from '../HandleFocusIn/HandleFocusIn.ts'
import * as LoadContent2 from '../LoadContent2/LoadContent2.ts'
import * as Render2 from '../Render2/Render2.ts'
import * as RenderEventListeners from '../RenderEventListeners/RenderEventListeners.ts'
import * as ShowAbout from '../ShowAbout/ShowAbout.ts'
import * as ShowAboutElectron from '../ShowAboutElectron/ShowAboutElectron.ts'

export const commandMap = {
  'About.create': Create.create,
  'About.diff2': Diff2.diff2,
  'About.dispose': Dispose.dispose,
  'About.focusNext': WrapCommand.wrapCommand(FocusNext.focusNext),
  'About.focusPrevious': WrapCommand.wrapCommand(FocusPrevious.focusPrevious),
  'About.getCommandIds': WrapCommand.getCommandIds,
  'About.getKeyBindings': GetKeyBindings.getKeyBindings,
  'About.handleClickButton': WrapCommand.wrapCommand(HandleClickButton.handleClickButton),
  'About.handleClickClose': WrapCommand.wrapCommand(HandleClickClose.handleClickClose),
  'About.handleClickCopy': WrapCommand.wrapCommand(HandleClickCopy.handleClickCopy),
  'About.handleClickOk': WrapCommand.wrapCommand(HandleClickOk.handleClickOk),
  'About.handleFocusIn': WrapCommand.wrapAsyncCommand(HandleFocusIn.handleFocusIn),
  'About.loadContent2': WrapCommand.wrapAsyncCommand(LoadContent2.loadContent2),
  'About.render2': Render2.doRender,
  'About.renderEventListeners': RenderEventListeners.renderEventListeners,
  'About.showAbout': ShowAbout.showAbout,
  'About.showAboutElectron': ShowAboutElectron.showAboutElectron,
}
