const compose = require('next-compose')
const withCSS = require('@zeit/next-css')
const withImages = require('next-images')

module.exports = compose([[withImages], [withCSS]])
