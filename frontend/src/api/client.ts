import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { SchemaLink } from 'apollo-link-schema'
import { schema } from './schema'

const link = new SchemaLink({ schema })

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 */
const createApolloClient = (initialState = {}) =>
  new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: link,
    cache: new InMemoryCache().restore(initialState),
  })

let apolloClient: ReturnType<typeof createApolloClient> | null = null

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 * @param  {Object} initialState
 */
const initApolloClient = (initialState?: object) =>
  !process.browser
    ? // Make sure to create a new client for every server-side request so that data
      // isn't shared between connections (which would be bad)
      createApolloClient(initialState)
    : // Reuse client on the client-side
      (apolloClient = apolloClient || createApolloClient(initialState))

export { initApolloClient }
