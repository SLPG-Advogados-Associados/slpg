
const postsQuery = `
  query BLOG($limit: Int!, $start: Int!) {
    posts: blogs(limit: $limit, start: $start) {
      id
      slug
    }
  }
`

module.exports.exportPathMap = async (pages, { dev }) => {
  // during development, build any dynamic page.
  if (dev) return pages

  delete pages['/blogue/[page]']
  delete pages['/noticias/[slug]']

  return pages

  /**
   * build blog post pages.
   */

  let pager = 0
  let hasMore
  const limit = 6 // same as on src/pages/blogue/index.page.tsx

  do {
    // + 1 to always verify if a next page is available
    const variables = {
      start: pager * limit,
      limit: limit + 1,
    }
    const { posts } = await client.request(postsQuery, variables)

    pager++
    hasMore = posts.length > limit

    for (const { slug } of posts) {
      pages[`/noticias/${slug}`] = {
        page: '/noticias/[slug]',
        query: { slug },
      }
    }
  } while (hasMore)

  /**
   * build blog listing pages.
   */

  for (let page = 1; page < pager; page++) {
    pages[`/blogue/${page}`] = {
      page: '/blogue/[page]',
      query: { page },
    }
  }

  return pages
}
