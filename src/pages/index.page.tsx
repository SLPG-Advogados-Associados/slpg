import React from 'react'
import { theme } from 'styled-tools'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { withGraphQL, GT } from '~api'
import { Container, ItemTitle, Button, styled, classed, t } from '~design'
import { PostListItem } from '~modules/blog'
import { list as expertises } from '~modules/expertise'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_LATEST } from './index.gql'

const Welcome = styled.div`
  height: 28rem;
  padding: 3.75rem 1.5rem;
  font-size: ${theme('fontSize.heading')};
  text-align: center;
  color: white;
  background: url('/background.jpg') center no-repeat;
  background-size: cover;

  .phone {
    display: block;
    font-weight: bold;
  }

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: block;
    padding: 3.75rem;
  }
`

const LocalMenuItem = styled(Button.withComponent('a'))`
  display: flex;
  justify-content: center;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: inline-flex;
  }
`

const MoreCard = styled(classed.article`px-md pb-md text-center`)`
  flex-grow: 1;
  flex-basis: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

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

  return (
    <Page>
      <Welcome>
        <p className="mb-4">
          Nosso trabalho é defender os direitos da classe trabalhadora.
        </p>
        <p className="mb-4">
          Ligue: <span className="phone">(48) 3024-4166</span>
        </p>
      </Welcome>

      <nav className="bg-button">
        <Container className="text-center" fullOnMobile>
          {expertises.map(({ id, href, label }) => (
            <LocalMenuItem key={id} href={href} title={label} alt={label}>
              {label}
            </LocalMenuItem>
          ))}
        </Container>
      </nav>

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
        <div className="flex">
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
