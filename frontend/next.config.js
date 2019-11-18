const compose = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

const plugins = [[withImages], [withCSS]]

const config = {
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

    return config
  },
}

module.exports = compose(plugins, config)
