import React from 'react'
import Head from 'next/head'
import { pipe, map, reject, isNil, mergeAll } from 'ramda'
import { useRouter, origin } from '~app/lib/router'
import { Header } from './Header'
import { Footer } from './Footer'
import { ContactCTA } from './ContactCTA'

interface Meta {
  siteName?: string
  title?: string
  description?: string
  url?: string
  image?: string
  type?: string
  other?: React.ReactNode
}

const defaults: Meta = {
  siteName: 'SLPG Advogados Associados',
  description: 'Nosso trabalho é defender os direitos da classe trabalhadora.',
  image: origin + '/site-image.png',
  type: 'article',
  other: null,
}

const merge = pipe(map(reject(isNil)), mergeAll)

interface Props {
  meta: Meta
  prefixTitle?: boolean
  off?: {
    contactCTA?: boolean
  }
}

const Page: React.FC<Props> = ({
  children,
  prefixTitle = true,
  meta: override = {},
  off = {},
}) => {
  const router = useRouter()
  const pathname = router.asPath.replace(/\?.*/gu, '').replace(/#.*/gu, '')

  const url = origin + pathname
  const title = override.title
    ? prefixTitle
      ? `${defaults.siteName} - ${override.title}`
      : override.title
    : defaults.siteName

  const meta: Meta = merge([defaults, override, { url, title }])

  // fix relative images.
  if (meta.image.indexOf('/') === 0) meta.image = origin + meta.image

  // prettier-ignore
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="robots" content="follow, index" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* Primary Meta Tags */}
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta itemProp="name" content={meta.title} />

        <meta name="description" content={meta.description} />
        <meta itemProp="description" content={meta.description} />

        <meta itemProp="image" content={meta.image} />

        {/* Open Graph / Facebook */}
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:type" content={meta.type} />
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

        {meta.other}
      </Head>

      <Header />

      {children}

      {!off.contactCTA ? <ContactCTA /> : null}

      <Footer />
    </>
  )
}

export { Page }
