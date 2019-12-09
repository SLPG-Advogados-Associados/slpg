import { GT } from '~api'
import typeDefs from './newsletter.graphql'

const subscribeError = new Error('Could not subscribe')

const Mutation: GT.MutationResolvers = {
  subscribe: (_root, args) =>
    fetch('/.netlify/functions/newsletter-form', {
      method: 'POST',
      body: JSON.stringify(args),
    })
      .then(response => {
        if (response.status !== 200) throw subscribeError
        return true
      })
      .catch(() => {
        throw subscribeError
      }),
}

const resolvers = { Mutation }

export { typeDefs, resolvers }
