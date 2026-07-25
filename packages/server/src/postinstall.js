import { cp, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const root = join(__dirname, '..', '..', '..')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const nodeModulesPath = join(root, 'node_modules')

const aboutWorkerPath = join(root, '.tmp', 'dist', 'dist', 'aboutWorkerMain.js')

const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

const staticServerConfigPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'config.json')

const sharedProcessConfigPath = join(nodeModulesPath, '@lvce-editor', 'shared-process', 'config.json')

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(serverStaticPath)
const commitHash = dirents.find(isCommitHash) || ''
const rendererWorkerMainPath = join(serverStaticPath, commitHash, 'packages', 'renderer-worker', 'dist', 'rendererWorkerMain.js')

const content = await readFile(rendererWorkerMainPath, 'utf-8')
const remoteUrl = getRemoteUrl(aboutWorkerPath)
if (!content.includes('// const aboutViewWorkerUrl = ')) {
  const occurrence = `const aboutViewWorkerUrl = \`\${assetDir}/packages/about-view-worker/dist/aboutWorkerMain.js\``
  const replacement = `// const aboutViewWorkerUrl = \`\${assetDir}/packages/about-view-worker/dist/aboutWorkerMain.js\`
const aboutViewWorkerUrl = \`${remoteUrl}\``

  const newContent = content.replace(occurrence, replacement)
  if (content === newContent) {
    throw new Error(`replacement error`)
  }
  await writeFile(rendererWorkerMainPath, newContent)
}

await cp(staticServerConfigPath, sharedProcessConfigPath)
