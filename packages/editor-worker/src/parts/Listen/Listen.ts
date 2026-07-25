import { registerCommands } from '../AboutStates/AboutStates.ts'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { initializeFileSystemWorker } from '../InitializeFileSystemWorker/InitializeFileSystemWorker.ts'
import { initializeRendererWorker } from '../InitializeRendererWorker/InitializeRendererWorker.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  await initializeRendererWorker()
  await initializeFileSystemWorker()
}
