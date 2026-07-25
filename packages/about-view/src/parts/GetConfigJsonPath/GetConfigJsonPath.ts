import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getConfigJsonPath = async (): Promise<string> => {
  return RendererWorker.invoke('PlatformPaths.getConfigJsonPath')
}
