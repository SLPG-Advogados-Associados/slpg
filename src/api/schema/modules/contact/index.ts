import { GT } from '~api'
import typeDefs from './contact.graphql'

const contactError = new Error('Could not send contact information')

const Mutation: GT.MutationResolvers = {
  contact: (_root, args) =>
    fetch('/.netlify/functions/contact-form', {
      method: 'POST',
      body: JSON.stringify(args),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.status !== 200) throw contactError
        return true
      })
      .catch(() => {
        throw contactError
      }),
}

const resolvers = { Mutation }

export { typeDefs, resolvers }
