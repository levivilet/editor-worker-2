import { FileSystemWorker } from '@lvce-editor/rpc-registry'
import * as GetConfigJsonPath from '../GetConfigJsonPath/GetConfigJsonPath.ts'

export interface Config {
  readonly commit: string
  readonly date: string
  readonly productName: string
  readonly version: string
}

const getString = (config: Record<string, unknown>, key: string): string => {
  const value = config[key]
  if (typeof value !== 'string') {
    return ''
  }
  return value
}

export const loadConfig = async (): Promise<Config> => {
  const configJsonPath = await GetConfigJsonPath.getConfigJsonPath()
  // FileSystemWorker.readFile is a custom RPC that already returns a string.
  const content = await FileSystemWorker.readFile(configJsonPath)
  const config = JSON.parse(content) as Record<string, unknown>
  return {
    commit: getString(config, 'commit'),
    date: getString(config, 'date'),
    productName: getString(config, 'productName'),
    version: getString(config, 'version'),
  }
}
