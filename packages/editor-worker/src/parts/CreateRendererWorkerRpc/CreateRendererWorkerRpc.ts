import { type Rpc, WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const createRendererWorkerRpc = (): Promise<Rpc> => {
  return WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
}
