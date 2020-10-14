const compose = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')
const nextEnv = require('next-env')
const { exportPathMap } = require('./next.export')

require('dotenv-load')()
const withNextEnv = nextEnv()

const plugins = [[withNextEnv], [withImages], [withCSS]]

const config = {
  exportPathMap,
  trailingSlash: true,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => `page.${ext}`),
  webpack: config => {
    // disable TypeScript checks (use `yarn type-check` and editor plugins instead)
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    )

    config.module.rules.push({
      test: /\.(graphql|gql)$/u,
      exclude: /node_modules/u,
      loader: 'graphql-tag/loader',
    })

    config.module.rules.push({
      test: /\.md$/,
      loader: 'frontmatter-markdown-loader',
      options: { mode: ['body'] }
    })

    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    })

    // avoid trying to parse Flow files.
    config.module.rules.push({ test: /\.flow$/u, loader: 'ignore-loader' })

    return config
  },
}

module.exports = compose(plugins, config)
