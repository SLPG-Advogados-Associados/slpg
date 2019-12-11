import { GT } from '~api'
import { blog } from '~content'
import typeDefs from './blog.graphql'

// `./slug-of-post.md` becomes `slug-of-post`
const pathToSlug = (id: string) => id.slice(2).slice(0, -3)

const posts = blog
  .keys()
  .map(path => {
    const slug = pathToSlug(path)
    const { attributes, body } = blog(path)
    return { ...attributes, body, slug, id: slug }
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1))

const load = (id: string) => posts.find(post => post.id === id)

const Query: GT.QueryResolvers = {
  posts: (_root, { limit = 10, start = 0 }) => {
    if (limit > 50) {
      throw new Error('Cannot require more than 50 posts at once')
    }

    const items = posts.slice(start, limit + start)

    return {
      id: `${limit}-${start}`,
      count: items.length,
      total: posts.length,
    }
  },

  postById: (_root, { id }) => load(id),
}

const PostsResultItem: GT.PostsResultItemResolvers = {
  item: post => post,
}

const Post: GT.PostResolvers = {
  image: ({ image: url }) => (url ? { url } : null),
}

const resolvers = { Query, PostsResultItem, Post }

export { typeDefs, resolvers }
