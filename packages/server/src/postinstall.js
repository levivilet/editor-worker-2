import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = join(currentDir, '..', '..', '..')
const editorWorkerPath = join(root, '.tmp', 'dist', 'editor-worker', 'dist', 'editorWorkerMain.js')
const require = createRequire(import.meta.url)
const serverPath = require.resolve('@lvce-editor/server/src/server.js')
const serverRequire = createRequire(serverPath)
const staticServerPackagePath = serverRequire.resolve('@lvce-editor/static-server/package.json')
const staticPath = join(dirname(staticServerPackagePath), 'static')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const folders = await readdir(staticPath, { withFileTypes: true })
const commitHash = folders.find((item) => item.isDirectory() && item.name !== 'auth')?.name || ''
const rendererProcessPath = join(staticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const remoteUrl = getRemoteUrl(editorWorkerPath)
const occurrence = '`${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`'
const content = await readFile(rendererProcessPath, 'utf8')

if (!content.includes(remoteUrl)) {
  const newContent = content.replace(occurrence, `\`${remoteUrl}\``)
  if (newContent === content) {
    throw new Error('Builtin editor worker path not found')
  }
  await writeFile(rendererProcessPath, newContent)
}
