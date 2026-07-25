import { context, type BuildOptions } from 'esbuild'
import { join } from 'node:path'
import { root } from './root.ts'

const createOptions = (entryPoint: string, outfile: string): BuildOptions => ({
  bundle: true,
  entryPoints: [join(root, entryPoint)],
  external: ['electron', 'node:buffer', 'node:worker_threads', 'ws'],
  format: 'esm',
  outfile: join(root, outfile),
})

const options = [
  createOptions('packages/editor-worker/src/editorWorkerMain.ts', '.tmp/dist/editor-worker/dist/editorWorkerMain.js'),
  createOptions(
    'packages/text-document-worker/src/textDocumentWorkerMain.ts',
    '.tmp/dist/text-document-worker/dist/textDocumentWorkerMain.js',
  ),
]

for (const option of options) {
  const buildContext = await context(option)
  await buildContext.watch()
}
