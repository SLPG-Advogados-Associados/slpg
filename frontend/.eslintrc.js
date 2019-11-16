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
    'import/resolver': {
      node: { extensions },
      alias: {
        map: [
          ['~app', `${__dirname}/src`],
          ['~design', `${__dirname}/src/design`],
        ],
        extensions,
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
