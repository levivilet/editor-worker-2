import type { Config } from '../LoadConfig/LoadConfig.ts'
import * as FormatAboutDate from '../FormatAboutDate/FormatAboutDate.ts'
import * as GetBrowser from '../GetBrowser/GetBrowser.ts'

export const getDetailStringWeb = (config: Config): readonly string[] => {
  const now = Date.now()
  const formattedDate = FormatAboutDate.formatAboutDate(config.date, now)
  const browser = GetBrowser.getBrowser()
  const lines = [`Version: ${config.version}`, `Commit: ${config.commit}`, `Date: ${formattedDate}`, `Browser: ${browser}`]
  return lines
}
