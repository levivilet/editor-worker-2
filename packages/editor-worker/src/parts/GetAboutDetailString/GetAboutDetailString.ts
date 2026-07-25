import type { Config } from '../LoadConfig/LoadConfig.ts'
import * as FormatAboutDate from '../FormatAboutDate/FormatAboutDate.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as Process from '../Process/Process.ts'

export const getDetailString = async (config: Config): Promise<string> => {
  const [electronVersion, nodeVersion, chromeVersion, v8Version] = await Promise.all([
    Process.getElectronVersion(),
    Process.getNodeVersion(),
    Process.getChromeVersion(),
    Process.getV8Version(),
  ])
  const now = Date.now()
  const formattedDate = FormatAboutDate.formatAboutDate(config.date, now)
  const lines = [
    `Version: ${config.version}`,
    `Commit: ${config.commit}`,
    `Date: ${formattedDate}`,
    `Electron: ${electronVersion}`,
    `Chromium: ${chromeVersion}`,
    `Node: ${nodeVersion}`,
    `V8: ${v8Version}`,
  ]
  return JoinLines.joinLines(lines)
}
