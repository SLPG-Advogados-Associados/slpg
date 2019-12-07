import { makeExecutableSchema } from 'graphql-tools'
import { GT } from '~api'

import * as core from './modules/core'
import * as blog from './modules/blog'
import * as team from './modules/team'
import * as contact from './modules/contact'

interface Module {
  typeDefs: string
  resolvers: {
    [key: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [prop: string]: GT.Resolver<any, any, any, any>
    }
  }
}

const modules: Module[] = [core, blog, team, contact]

const typeDefs = modules.map(mod => mod.typeDefs)
const resolvers = {}

for (const { resolvers: types = {} } of modules) {
  for (const [type, fields] of Object.entries(types)) {
    resolvers[type] = { ...resolvers[type], ...fields }
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  inheritResolversFromInterfaces: true,
})

export { schema }
