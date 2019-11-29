const { GraphQLClient } = require('graphql-request')

const NEXT_STATIC_BACKEND_API_HOST = process.env.NEXT_STATIC_BACKEND_API_HOST
const client = new GraphQLClient(NEXT_STATIC_BACKEND_API_HOST)

const postsQuery = `
  query BLOG($limit: Int!, $start: Int!) {
    posts: blogs(limit: $limit, start: $start) {
      id
    }
  }
`

module.exports.exportPathMap = async (pages, { dev }) => {
  if (dev) return pages

  if (!NEXT_STATIC_BACKEND_API_HOST) {
    throw new Error(
      'You must define NEXT_STATIC_BACKEND_API_HOST in orther to export static pages'
    )
  }

  delete pages['/blogue/[page]']
  delete pages['/noticias/[post]']

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

    for (const { id } of posts) {
      pages[`/noticias/${id}`] = {
        page: '/noticias/[post]',
        query: { post: id },
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
