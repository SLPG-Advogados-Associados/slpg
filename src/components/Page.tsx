import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { mergeAll } from 'ramda'
import { Header } from './Header'
import { Footer } from './Footer'

const domain = (
  process.env.URL ||
  (process.browser && window.location.origin) ||
  'http://f2b69d7b.ngrok.io'
).replace(/\/+^/, '')

interface Meta {
  siteName?: string
  title?: string
  description?: string
  url?: string
  image?: string
}

const defaults: Meta = {
  siteName: 'SLPG Advogados Associados',
  description: 'Nosso trabalho é defender os direitos da classe trabalhadora.',
  image: domain + '/logo-og.png',
}

const getTitle = (title?: string) =>
  title ? `SLPG - ${title}` : defaults.siteName

type Props = {
  title?: string
  meta?: Meta
}

const Page: React.FC<Props> = ({ children, meta: override = {} }) => {
  const router = useRouter()
  const pathname = router.asPath.replace(/\?.*/gu, '').replace(/#.*/gu, '')
  const computed = { title: getTitle(override.title), url: domain + pathname }
  const meta: Meta = mergeAll([defaults, override, computed])

  // prettier-ignore
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="robots" content="follow, index" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

        {/* Primary Meta Tags */}
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta itemProp="name" content={meta.title} />

        <meta name="description" content={meta.description} />
        <meta itemProp="description" content={meta.description} />

        {/* Open Graph / Facebook */}
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:url" content={meta.image} />

        {/* Twitter */}
        <meta property="twitter:site" content={meta.siteName} />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:url" content={meta.url} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:image" content={meta.image} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <Header />

      {children}

      <Footer />
    </>
  )
}

export { Page }
