import React from 'react'
import NextApp from 'next/app'
import ErrorPage from './_error.page'
import { ThemeProvider } from '~design'
import { Provider as UserAgentProvider, getUserAgent } from '~app/lib/userAgent'

import '~design/base.css'
import '../setup'

class App extends NextApp<{ statusCode: number; userAgent: string }> {
  static async getInitialProps({ Component, ctx }) {
    const props = {
      pageProps: {},
      userAgent: getUserAgent(ctx),
    }

    try {
      if (Component.getInitialProps) {
        props.pageProps = await Component.getInitialProps(ctx)
      }

      return props
    } catch (err) {
      return {
        ...props,
        ...(await ErrorPage.getInitialProps({ ...ctx, err })),
      }
    }
  }

  public render() {
    const { statusCode, userAgent, ...props } = this.props

    return statusCode ? (
      <ErrorPage statusCode={statusCode} />
    ) : (
      <ThemeProvider>
        <UserAgentProvider userAgent={userAgent}>
          <NextApp {...props} />
        </UserAgentProvider>
      </ThemeProvider>
    )
  }
}

export default App
