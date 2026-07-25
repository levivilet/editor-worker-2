import * as CloseWidget from '../CloseWidget/CloseWidget.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const close = async (): Promise<void> => {
  await CloseWidget.closeWidget(ViewletModuleId.About)
}
