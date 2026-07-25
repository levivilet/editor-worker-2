import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundleJs } from './bundleJs.ts'
import { root } from './root.ts'

interface PackageConfig {
  readonly directory: string
  readonly main: string
}

const packages: readonly PackageConfig[] = [
  {
    directory: 'editor-worker',
    main: 'dist/editorWorkerMain.js',
  },
  {
    directory: 'text-document-worker',
    main: 'dist/textDocumentWorkerMain.js',
  },
]

const copyPackageMetadata = async ({ directory, main }: PackageConfig): Promise<void> => {
  const sourceDirectory = join(root, 'packages', directory)
  const targetDirectory = join(root, '.tmp', 'dist', directory)
  const packageJson = JSON.parse(await readFile(join(sourceDirectory, 'package.json'), 'utf8'))
  delete packageJson.devDependencies
  delete packageJson.jest
  delete packageJson.scripts
  packageJson.main = main
  await writeFile(join(targetDirectory, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
  await cp(join(root, 'README.md'), join(targetDirectory, 'README.md'))
  await cp(join(root, 'LICENSE'), join(targetDirectory, 'LICENSE'))
}

const outputDirectory = join(root, '.tmp', 'dist')
await rm(outputDirectory, { force: true, recursive: true })
for (const { directory } of packages) {
  await mkdir(join(outputDirectory, directory, 'dist'), { recursive: true })
}

await bundleJs()
await Promise.all(packages.map(copyPackageMetadata))
