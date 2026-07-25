import * as AboutStrings from '../AboutStrings/AboutStrings.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.ts'
import * as ElectronMessageBoxType from '../ElectronMessageBoxType/ElectronMessageBoxType.ts'
import * as GetAboutDetailString from '../GetAboutDetailString/GetAboutDetailString.ts'
import * as GetWindowId from '../GetWindowId/GetWindowId.ts'
import * as LoadConfig from '../LoadConfig/LoadConfig.ts'

export const showAboutElectron = async (): Promise<void> => {
  const [windowId, config] = await Promise.all([GetWindowId.getWindowId(), LoadConfig.loadConfig()])
  const detail = await GetAboutDetailString.getDetailString(config)
  const { productName } = config
  const options = {
    buttons: [AboutStrings.copy(), AboutStrings.ok()],
    detail,
    message: productName,
    productName,
    type: ElectronMessageBoxType.Info,
    windowId,
  }
  const index = await ElectronDialog.showMessageBox(options)
  switch (index) {
    case 0:
      await ClipBoard.writeText(detail)
      break
    default:
      break
  }
}
