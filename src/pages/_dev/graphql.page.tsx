/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { createGlobalStyle } from 'styled-components'
import NoSSR from 'react-no-ssr'
import consoleSuppressor from 'console-suppress'
import { link } from '~api/link'

// hide annoying React warning made by inner dependency.
consoleSuppressor.suppress(/for a non-boolean attribute/u)

const Styles = createGlobalStyle`
  body,
  html {
    width: 100vw;
  }

  .playground {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100vh !important;
    width: 100vw !important;
    margin: 0 !important;
  }
`

const createLink = () => ({ link })

const SafePlayground = () => {
  const { Provider } = require('react-redux')
  const { Playground, store } = require('graphql-playground-react')

  return (
    <Provider store={store}>
      <Playground store={store} createApolloLink={createLink} />
    </Provider>
  )
}

const GraphQLPlaygroundPage = () => (
  <NoSSR>
    <Styles />
    <SafePlayground />
  </NoSSR>
)

export default GraphQLPlaygroundPage
