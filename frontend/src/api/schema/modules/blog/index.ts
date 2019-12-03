import { GT } from '~api'
import typeDefs from './blog.graphql'

const Query: GT.QueryResolvers = {
  posts: () => [],
}

const resolvers = { Query }

export { typeDefs, resolvers }
