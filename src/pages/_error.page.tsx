import React from 'react'
import { NextPage } from 'next'
import { Heading, HTMLContent, styled, t } from '~design'
import { Section } from '~app/components/Section'
import { Page } from '~app/components/Page'

const noIndex = <meta name="robots" content="noindex" />

const metas = {
  404: {
    title: 'Página não encontrada',
    description: 'Não foi possível localizar a página requisitada.',
    other: noIndex,
  },

  default: {
    title: 'Não foi possível acessar esta página',
    description:
      'Essa página não pode ser exibida no momento. Por favor, tente novamente mais tarde.',
    other: noIndex,
  },
}

const StyledSection = styled(Section)`
  margin: 3rem 0;
  text-align: center;
  border: 0;

  .code {
    display: block;
    font-size: 10rem;
    color: ${t.theme('colors.primary')};
  }
`

const ErrorPage: NextPage<{ statusCode: number }> = ({ statusCode }) => {
  const meta = metas[statusCode] || metas.default

  return (
    <Page meta={meta}>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>{meta.title}</Heading>
      </div>

      <StyledSection>
        <HTMLContent>
          <span className="code">{statusCode}</span>
          <a href="/blogue">Que tal visitar nosso blogue?</a>
        </HTMLContent>
      </StyledSection>
    </Page>
  )
}

ErrorPage.getInitialProps = async ({ res, err }) => {
  const statusCode = err ? err.statusCode : res ? res.statusCode : 404

  // ensure correct status is sent from SSR.
  if (res) res.statusCode = statusCode

  return { statusCode }
}

export default ErrorPage
