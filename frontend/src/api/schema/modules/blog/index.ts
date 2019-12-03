import GraphQLJSON from 'graphql-type-json'
import { GT } from '~api'
import typeDefs from './blog.graphql'

const version = '1.0'

const Query: GT.QueryResolvers = {
  version: () => version,
}

const Mutation: GT.MutationResolvers = {
  status: () => true,
}

const resolvers = { Query, Mutation, JSON: GraphQLJSON }

export { typeDefs, resolvers }
