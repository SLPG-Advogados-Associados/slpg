
const path = require('path')
const glob = require('glob')
const slugify = require('slugify')

const admin = path.resolve(__dirname, 'src/admin')

const getDynamicPages = () => {
  const pages = {}
  const posts = glob.sync(`${admin}/content/blog/*.md`).map(post => path.basename(post, '.md'))


  /**
   * build blog post pages.
   */

  for (const orig of posts) {
    const slug = slugify(orig)

    pages[`/noticias/${slug}`] = {
      page: '/noticias/[slug]',
      query: { slug },
    }
  }

  /**
   * build blog listing pages.
   */

  for (let page = 1; page < Math.ceil(posts.length / 6); page++) {
    pages[`/blogue/${page}`] = {
      page: '/blogue/[page]',
      query: { page },
    }
  }

  return pages
}

module.exports.getDynamicPages = getDynamicPages

module.exports.exportPathMap = async (pages, { dev }) => {
  // during development, build any dynamic page.
  if (dev) return pages

  delete pages['/blogue/[page]']
  delete pages['/noticias/[slug]']

  for (const [path, page] of Object.entries(getDynamicPages())) {
    pages[path] = page
  }

  return pages
}
