const compose = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

const plugins = [[withImages], [withCSS]]

const config = {
  webpack: config => {
    // disable TypeScript checks (use `yarn type-check` and editor plugins instead)
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin'
    )

    return config
  },
}

module.exports = compose(plugins, config)
