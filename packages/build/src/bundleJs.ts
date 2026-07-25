import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'node:path'
import { rollup, type RollupOptions } from 'rollup'
import { root } from './root.ts'

const createOptions = (input: string, output: string): RollupOptions => ({
  input: join(root, input),
  output: {
    file: join(root, output),
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
})

const options = [
  createOptions('packages/editor-worker/src/editorWorkerMain.ts', '.tmp/dist/editor-worker/dist/editorWorkerMain.js'),
  createOptions(
    'packages/text-document-worker/src/textDocumentWorkerMain.ts',
    '.tmp/dist/text-document-worker/dist/textDocumentWorkerMain.js',
  ),
]

export const bundleJs = async (): Promise<void> => {
  for (const option of options) {
    const bundle = await rollup(option)
    const output = Array.isArray(option.output) ? option.output[0] : option.output
    await bundle.write(output!)
  }
}
