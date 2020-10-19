const fs = require('fs')
const path = require('path')
const { createSitemap } = require('sitemap')
const glob = require('glob')
const { getDynamicPages } = require('./next.export')

const paths = {
  admin: path.resolve(__dirname, 'src/admin'),
  pages: path.resolve(__dirname, 'src/pages'),
  dest: path.resolve(__dirname, 'out/sitemap.xml')
}

;(async () => {
  const sitemap = createSitemap({ hostname: 'https://www.slpgadvogados.adv.br' })

  for (const [url, page] of Object.entries(getDynamicPages())) {
    const lastmodfile = path.resolve(paths.pages, path.join(paths.pages, page.page + '.page.tsx'))
    sitemap.add({ url, lastmodfile })
  }

  for (const absolute of glob.sync(`${paths.pages}/**/*.page.*`)) {
    const relative = path.relative(paths.pages, absolute)
    
    // exclude special pages.
    if (relative.indexOf('_') === 0) continue

    // exclude dynamic pages.
    if (relative.includes('[')) continue

    const url = relative
      .replace(/index\.page\.tsx$/, '')
      .replace(/\.page\.tsx$/, '')
      .replace(/\/$/, '')

    sitemap.add({ url, lastmodfile: absolute })
  }

  fs.writeFileSync(paths.dest, sitemap.toXML(), 'utf8')
})()
