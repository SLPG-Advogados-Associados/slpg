import { GT } from '~api'
import typeDefs from './newsletter.graphql'

const Query: GT.QueryResolvers = {
  interests: () =>
    fetch('/.netlify/functions/newsletter-interests').then(res => res.json()),
}

const Mutation: GT.MutationResolvers = {
  subscribe: (_root, args) => {
    const onFail = () => {
      throw new Error('Could not subscribe')
    }

    return fetch('/.netlify/functions/newsletter-form', {
      method: 'POST',
      body: JSON.stringify(args),
    })
      .then(res => res.status === 200 || onFail())
      .catch(() => onFail)
  },
}

const resolvers = { Query, Mutation }

export { typeDefs, resolvers }
