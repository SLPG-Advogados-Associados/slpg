import { GT } from '~api'
import { team as teamLoader } from '~content'
import typeDefs from './team.graphql'
import teamConfig from '~content/team.yml'

const map = teamLoader.keys().reduce((carry, file) => {
  // `./slug-of-member.json` becomes `slug-of-member`
  const slug = file.slice(2).slice(0, -5)

  return { ...carry, [slug]: { ...teamLoader(file), slug, id: slug } }
}, {})

const members = Object.values(map)

const team = teamConfig.members
  .map(({ reference: name }) =>
    members.find((member: { name: string }) => member.name === name)
  )
  .filter(Boolean)

const Query: GT.QueryResolvers = {
  team: () => team,
  member: (_root, { id }) => map[id],
}

const resolvers = { Query }

export { typeDefs, resolvers }
