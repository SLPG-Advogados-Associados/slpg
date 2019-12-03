import { GT } from '~api'
import { blog } from '~content'
import typeDefs from './blog.graphql'

// `./slug-of-post.md` becomes `slug-of-post`
const pathToSlug = (id: string) => id.slice(2).slice(0, -3)
const slugToPath = (slug: string) => `./${slug}.md`

const posts = blog.keys().map(pathToSlug)

const load = (slug: string) => {
  const { attributes, body } = blog(slugToPath(slug))
  return { ...attributes, body, slug, id: slug }
}

const Query: GT.QueryResolvers = {
  posts: (_root, { limit = 10, start = 0 }) => {
    if (limit > 50) {
      throw new Error('Cannot require more than 50 posts at once')
    }

    const items = posts.slice(start, limit)

    return {
      id: `${limit}-${start}`,
      count: items.length,
      total: posts.length,
      items,
    }
  },

  postById: (_root, { id }) => load(id),
}

const PostsResult: GT.PostsResultResolvers = {
  items: ({ items }: { items: string[] }) => items.map(id => ({ id })),
}

const PostsResultItem: GT.PostsResultItemResolvers = {
  item: ({ id }) => load(id),
}

const resolvers = { Query, PostsResult, PostsResultItem }

export { typeDefs, resolvers }
