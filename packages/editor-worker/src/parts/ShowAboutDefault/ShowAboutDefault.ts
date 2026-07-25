import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const showAboutDefault = async (): Promise<void> => {
  await RendererWorker.openWidget(ViewletModuleId.About)
}
