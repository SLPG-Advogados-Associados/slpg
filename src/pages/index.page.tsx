import React from 'react'
import { theme } from 'styled-tools'
import { useQuery } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { ItemTitle, Button, styled, t } from '~design'
import { PostListItem } from '~modules/blog'
import { list as expertises } from '~modules/expertise'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { LocalNav, LocalNavButton } from '~app/components/LocalNav'
import { BLOG_LATEST } from './index.gql'
import { WhatsApp } from './whats-app-icon'

const Welcome = styled.div`
  position: relative;
  height: 28rem;
  padding: 3.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme('fontSize.500')};
  text-align: center;
  color: white;
  background: url('/background.jpg') center no-repeat;
  background-size: cover;

  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .content {
    position: relative;
    z-index: 1;
    margin-bottom: 2rem;
  }

  a {
    color: inherit;
    text-decoration: underline;

    &:hover,
    &:focus {
      opacity: 0.8;
    }
  }

  .phone {
    font-weight: bold;
  }

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    padding: 3.75rem;
    font-size: ${theme('fontSize.heading')};
  }
`

const MoreCard = styled.article`
  flex-grow: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 0 ${t.theme('spacing.16')};
  text-align: center;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    padding: 0 ${t.theme('spacing.8')} ${t.theme('spacing.16')};
  }

  > img {
    max-width: 80%;
  }

  ${ItemTitle} {
    padding: 1.5rem 0 2rem;
  }
`

const HomePage = () => {
  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG_LATEST)
  const posts = blog.data ? blog.data.posts.items.map(({ item }) => item) : []

  const openWhatsApp = () =>
    window.open('https://wa.me/5548988359010', '_blank')

  return (
    <Page meta={{ type: 'website' }}>
      <Welcome>
        <div className="content">
          <p className="mb-4">
            Defendendo os direitos da classe trabalhadora desde 1997
          </p>

          <p className="mb-4">
            Formas de contato:
            <br />
            <span className="phone">
              <a href="tel:+554830244166">(48) 3024-4166</a>{' '}
              <a href="#" onClick={openWhatsApp}>
                <WhatsApp className="inline-block align-text-top" />
              </a>
              <br />
              <a href="mailto:contato@slpgadvogados.adv.br">
                contato@slpgadvogados.adv.br
              </a>
            </span>
          </p>

          {/* <p className="mb-4">
          Nosso trabalho é defender os direitos da classe trabalhadora.
        </p>
        <p className="mb-4">
          Ligue: <span className="phone">(48) 3024-4166</span>
        </p> */}
        </div>
      </Welcome>

      <LocalNav primary>
        {expertises.map(({ id, href, label }) => (
          <LocalNavButton
            key={id}
            href={href}
            title={label}
            alt={label}
            primary
          >
            {label}
          </LocalNavButton>
        ))}
      </LocalNav>

      <Section title="Blogue">
        {blog.data ? (
          <ul>
            {posts.map(post => (
              <li key={post.id} className="py-lg border-b-2">
                <PostListItem post={post} noImage />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="text-center my-20">
          <Button as="a" href="/blogue">
            Visite Nosso Blogue
          </Button>
        </div>
      </Section>

      <Section
        className="bg-aside pb-12 clear"
        title="Saiba mais sobre o Escritório"
      >
        <div className="md:flex md:flex-col lg:flex-row">
          <MoreCard>
            <img
              src="/jurisdiction.png"
              alt="Mapa do Brasil com estados onde atuamos em destaque"
            />
            <ItemTitle>Atuação em outros estados da federação</ItemTitle>
            <Button
              className="mt-auto"
              as="a"
              href="/atuacao-em-outros-estados-da-federacao"
            >
              Saiba Mais
            </Button>
          </MoreCard>

          <MoreCard>
            <img src="/superior-courts.png" alt="Logotipo do CNASP" />
            <ItemTitle>Atuação nos Tribunais Superiores</ItemTitle>
            <Button
              className="mt-auto"
              as="a"
              href="/atuacao-nos-tribunais-superiores"
            >
              Saiba Mais
            </Button>
          </MoreCard>

          <MoreCard>
            <img
              src="/cnasp.jpg"
              alt="Logotipo do CNASP"
              className="rounded-full"
            />
            <ItemTitle>
              O Coletivo Nacional de Advogados de Servidores Públicos
            </ItemTitle>
            <Button
              className="mt-auto"
              as="a"
              href="o-coletivo-nacional-de-advogados-de-servidores-publicos"
            >
              Saiba Mais
            </Button>
          </MoreCard>
        </div>
      </Section>
    </Page>
  )
}

export default withGraphQL(HomePage)
