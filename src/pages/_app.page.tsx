import React from 'react'
import NextApp from 'next/app'
import ErrorPage from './_error.page'
import { ThemeProvider } from '~design'

import '../setup'

class App extends NextApp<{ statusCode: number }> {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    try {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }

      return { pageProps }
    } catch (err) {
      return {
        ...(await ErrorPage.getInitialProps({ ...ctx, err })),
        pageProps,
      }
    }
  }

  public render() {
    const { statusCode, ...props } = this.props

    return statusCode ? (
      <ErrorPage statusCode={statusCode} />
    ) : (
      <ThemeProvider>
        <NextApp {...props} />
      </ThemeProvider>
    )
  }
}

export default App
