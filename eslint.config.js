import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedActions,
  ...config.recommendedVirtualDom,
  ...config.recommendedTsconfig,
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      'e2e/no-imports': 'off',
    },
  },
]
