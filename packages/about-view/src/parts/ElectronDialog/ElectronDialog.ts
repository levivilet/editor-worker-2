import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetWindowId from '../GetWindowId/GetWindowId.ts'

export const showMessageBox = async (options: any): Promise<any> => {
  const windowId = await GetWindowId.getWindowId()
  const finalOptions = {
    ...options,
    windowId,
  }
  return RendererWorker.showMessageBox(finalOptions)
}
