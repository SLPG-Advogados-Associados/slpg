import React from 'react'
import Head from 'next/head'
import { Header } from './Header'

const getTitle = (title?: string) =>
  'SLPG Advogados Associados' + (title ? ` - ${title}` : '')

type Props = {
  title?: string
}

const Page: React.FC<Props> = ({ children, title }) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
      <title>{getTitle(title)}</title>
    </Head>

    <Header />

    {children}
  </>
)

export { Page }
