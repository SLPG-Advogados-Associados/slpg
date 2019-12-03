import { GT } from '~api'
import { blog } from '~content'
import typeDefs from './blog.graphql'

const posts = blog.keys()

const postById = (id: string) => {
  const { attributes, body } = blog(id)
  return { ...attributes, body, id }
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

  postBySlug: (_root, { slug }) => postById(`./${slug}.md`),
}

const PostsResult: GT.PostsResultResolvers = {
  items: ({ items }: { items: string[] }) => items.map(id => ({ id })),
}

const PostsResultItem: GT.PostsResultItemResolvers = {
  item: ({ id }) => postById(id),
}

const resolvers = { Query, PostsResult, PostsResultItem }

export { typeDefs, resolvers }
