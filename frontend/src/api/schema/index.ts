import { makeExecutableSchema } from 'graphql-tools'

import * as core from './modules/core'
import * as blog from './modules/blog'

const modules = [core, blog]

const createSchema = () => {
  const typeDefs = modules.map(mod => mod.typeDefs)
  const resolvers = {}

  for (const { resolvers: types = {} } of modules) {
    for (const [type, fields] of Object.entries(types)) {
      resolvers[type] = { ...resolvers[type], ...fields }
    }
  }

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    inheritResolversFromInterfaces: true,
  })
}

export { createSchema }
