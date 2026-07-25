import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedActions,
  ...config.recommendedVirtualDom,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'prefer-destructuring': 'off',
      '@cspell/spellchecker': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
  {
    files: [
      'packages/about-view/src/parts/ShowAboutElectron/ShowAboutElectron.ts',
      'packages/about-view/test/ElectronDialog.test.ts',
      'packages/about-view/test/ShowAboutElectron.test.ts',
    ],
    rules: {
      'virtual-dom/no-object-attribute-values': 'off',
    },
  },
  {
    files: ['packages/about-view/test/Get*VirtualDom.test.ts', 'packages/about-view/test/Render2.test.ts'],
    rules: {
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
]
