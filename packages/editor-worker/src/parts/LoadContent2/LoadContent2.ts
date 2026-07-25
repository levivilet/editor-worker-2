import type { AsyncCommandContext } from '@lvce-editor/viewlet-registry'
import type { AboutState } from '../AboutState/AboutState.ts'
import * as AboutFocusId from '../AboutFocusId/AboutFocusId.ts'
import * as GetAboutDetailStringWeb from '../GetAboutDetailStringWeb/GetAboutDetailStringWeb.ts'
import * as LoadConfig from '../LoadConfig/LoadConfig.ts'

export const loadContent2 = async (context: AsyncCommandContext<AboutState>): Promise<void> => {
  const config = await LoadConfig.loadConfig()
  await context.updateState((state) => ({
    ...state,
    focusId: AboutFocusId.Ok,
    lines: GetAboutDetailStringWeb.getDetailStringWeb(config),
    productName: config.productName,
  }))
}
