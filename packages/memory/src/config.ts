import { join } from 'node:path'
import { root } from './root.ts'

export const threshold = 460_000

export const instantiations = 1317

export const instantiationsPath = join(root, 'packages', 'about-view')

export const workerPath = join(root, '.tmp/dist/dist/aboutWorkerMain.js')

export const playwrightPath = new URL('../../../node_modules/playwright/index.mjs', import.meta.url).toString()
