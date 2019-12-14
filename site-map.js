const path = require('path')
const sitemap = require('nextjs-sitemap-generator')

sitemap({
  // alternateUrls: {
  //   en: 'https://example.en',
  //   es: 'https://example.es',
  //   ja: 'https://example.jp',
  //   fr: 'https://example.fr',
  // },
  baseUrl: 'https://www.alpgadvogados.adv.br',
  ignoredPaths: ['admin'],
  pagesDirectory: path.resolve(__dirname, './src/pages'),
  targetDirectory: 'out/',
  nextConfigPath: path.resolve(__dirname, './next.config.js'),
  // ignoredExtensions: ['png', 'jpg'],
  // pagesConfig: {
  //   '/login': {
  //     priority: '0.5',
  //     changefreq: 'daily',
  //   },
  // },
})
