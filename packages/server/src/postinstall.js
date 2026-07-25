import { readdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const root = join(currentDir, '..', '..', '..')
const editorWorkerPath = join(root, '.tmp', 'dist', 'editor-worker', 'dist', 'editorWorkerMain.js')
const textDocumentWorkerPath = join(root, '.tmp', 'dist', 'text-document-worker', 'dist', 'textDocumentWorkerMain.js')
const require = createRequire(import.meta.url)
const serverPath = require.resolve('@lvce-editor/server/src/server.js')
const serverRequire = createRequire(serverPath)
const sharedProcessPackagePath = serverRequire.resolve('@lvce-editor/shared-process/package.json')
const staticServerPackagePath = serverRequire.resolve('@lvce-editor/static-server/package.json')
const sharedProcessPath = join(dirname(sharedProcessPackagePath), 'src', 'parts', 'GetHeaders', 'GetHeaders.js')
const staticPath = join(dirname(staticServerPackagePath), 'static')

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const folders = await readdir(staticPath, { withFileTypes: true })
const commitHash = folders.find((item) => item.isDirectory() && item.name !== 'auth')?.name || ''
const rendererProcessPath = join(staticPath, commitHash, 'packages', 'renderer-process', 'dist', 'rendererProcessMain.js')
const editorWorkerRemoteUrl = getRemoteUrl(editorWorkerPath)
const textDocumentWorkerRemoteUrl = getRemoteUrl(textDocumentWorkerPath)

const patchRendererProcess = (content) => {
  let newContent = content
  if (!newContent.includes(editorWorkerRemoteUrl)) {
    const occurrence = '`${assetDir}/packages/editor-worker/dist/editorWorkerMain.js`'
    newContent = newContent.replace(occurrence, `\`${editorWorkerRemoteUrl}\``)
    if (newContent === content) {
      throw new Error('Builtin editor worker path not found')
    }
  }

  if (newContent.includes(textDocumentWorkerRemoteUrl)) {
    return newContent
  }

  const workerFnsOccurrence = 'const workerFns = [hydrate$3, hydrate$2, hydrate, hydrate$1];'
  const workerFnsReplacement = `const textDocumentWorkerUrl = ${JSON.stringify(textDocumentWorkerRemoteUrl)};
const hydrateEditorAndTextDocumentWorker = async () => {
  const editorResult = await hydrate$2();
  if (isError(editorResult)) {
    return editorResult;
  }
  const {
    port1,
    port2
  } = new MessageChannel();
  try {
    await create$w({
      method: ModuleWorkerWithMessagePort,
      name: 'Text Document Worker',
      port: port1,
      url: textDocumentWorkerUrl
    });
  } catch (textDocumentWorkerError) {
    remove$2('Editor Worker');
    return error(textDocumentWorkerError);
  }
  const editorPort = get$6('Editor Worker');
  editorPort.postMessage({
    jsonrpc: '2.0',
    method: 'TextDocumentWorker.setPort',
    params: [port2]
  }, [port2]);
  return success(undefined);
};
const workerFns = [hydrate$3, hydrate, hydrate$1];`
  newContent = newContent.replace(workerFnsOccurrence, workerFnsReplacement)
  if (!newContent.includes(textDocumentWorkerRemoteUrl)) {
    throw new Error('Builtin worker list not found')
  }

  const launchWorkersOccurrence = `const launchWorkers = async () => {
  {
    const results = await Promise.all(workerFns.map(call));`
  const launchWorkersReplacement = `const launchWorkers = async () => {
  {
    const editorResult = await hydrateEditorAndTextDocumentWorker();
    if (isError(editorResult)) {
      return editorResult;
    }
    const results = await Promise.all(workerFns.map(call));`
  const patchedContent = newContent.replace(launchWorkersOccurrence, launchWorkersReplacement)
  if (patchedContent === newContent) {
    throw new Error('Builtin worker launcher not found')
  }
  return patchedContent
}

const patchTextDocumentWorkerContentSecurityPolicy = (content) => {
  if (content.includes('textDocumentWorkerContentSecurityPolicy')) {
    return content
  }
  const occurrence = '  const dynamicCsp = ContentSecurityPolicyState.get(url)'
  const replacement = `  const textDocumentWorkerContentSecurityPolicy = absolutePath.endsWith('textDocumentWorkerMain.js')
    ? "default-src 'none'; sandbox allow-same-origin;"
    : undefined
  const dynamicCsp = ContentSecurityPolicyState.get(url) || textDocumentWorkerContentSecurityPolicy`
  const newContent = content.replace(occurrence, replacement)
  if (newContent === content) {
    throw new Error('Worker content security policy hook not found')
  }
  return newContent
}

const rendererProcessContent = await readFile(rendererProcessPath, 'utf8')
const newRendererProcessContent = patchRendererProcess(rendererProcessContent)
if (newRendererProcessContent !== rendererProcessContent) {
  await writeFile(rendererProcessPath, newRendererProcessContent)
}

const sharedProcessContent = await readFile(sharedProcessPath, 'utf8')
const newSharedProcessContent = patchTextDocumentWorkerContentSecurityPolicy(sharedProcessContent)
if (newSharedProcessContent !== sharedProcessContent) {
  await writeFile(sharedProcessPath, newSharedProcessContent)
}
