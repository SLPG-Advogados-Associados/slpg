import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      const styles = (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      )

      return { ...initialProps, styles }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <script
            type="text/javascript"
            async
            src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/8ff7da9a-de86-47f2-8dc2-7e93d78e0d98-loader.js"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
