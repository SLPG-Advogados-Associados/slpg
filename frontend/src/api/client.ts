import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'

const NODE_ENV = process.env.NODE_ENV || 'development'
const NEXT_STATIC_BACKEND_API_HOST = process.env.NEXT_STATIC_BACKEND_API_HOST

if (NODE_ENV === 'production' && !NEXT_STATIC_BACKEND_API_HOST) {
  throw new Error('You must define NEXT_STATIC_BACKEND_API_HOST on production')
}

const link = new HttpLink({
  uri: NEXT_STATIC_BACKEND_API_HOST || 'http://localhost:1337/graphql',
  credentials: 'include',
  fetch: !process.browser ? fetch : null,
})

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
