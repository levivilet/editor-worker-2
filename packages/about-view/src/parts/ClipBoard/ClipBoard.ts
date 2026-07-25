import { RendererWorker } from '@lvce-editor/rpc-registry'

export const writeText = async (text: string): Promise<void> => {
  await RendererWorker.writeClipBoardText(text)
}
