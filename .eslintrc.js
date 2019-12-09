const extensions = [
  // JavaScript
  '.js',
  '.json',
  '.mjs',
  '.es',
  '.node',
  '.jsx',
  // TypeScript
  '.ts',
  '.d.ts',
  '.tsx',
]

module.exports = {
  root: true,
  env: { browser: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      node: { extensions },
      alias: {
        map: [
          ['~app', `${__dirname}/src`],
          ['~api', `${__dirname}/src/api`],
          ['~modules', `${__dirname}/src/modules`],
          ['~design', `${__dirname}/src/design`],
          ['~content', `${__dirname}/src/admin/content`],
        ],
        extensions,
      },
    },
  },
  globals: {
    process: false,
    require: false,
    console: false,
    Promise: false,
    CMS: false,
  },
  rules: {
    'no-console': 'error',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
  },
}
