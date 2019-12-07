import { GT } from '~api'
import { team } from '~content'
import typeDefs from './team.graphql'

const members = team.keys().reduce((carry, file) => {
  // `./slug-of-member.json` becomes `slug-of-member`
  const slug = file.slice(2).slice(0, -5)

  return { ...carry, [slug]: { ...team(file), slug, id: slug } }
}, {})

const Query: GT.QueryResolvers = {
  team: () => Object.values(members),
  member: (_root, { id }) => members[id],
}

const resolvers = { Query }

export { typeDefs, resolvers }
