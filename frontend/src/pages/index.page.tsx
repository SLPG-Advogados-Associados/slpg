import React from 'react'
import styled from 'styled-components'
import { theme } from 'styled-tools'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { withGraphQL, GT } from '~api'
import { Container, Heading, ItemTitle, Button, classed } from '~design'
import { PostListItem } from '~modules/blog'
import { list as expertises } from '~modules/expertise'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_LATEST } from './index.gql'

const Welcome = styled.div`
  height: 450px;
  padding: 60px;
  font-size: ${theme('fontSize.heading')};
  text-align: center;
  color: white;
  background: url('/background.jpg') center no-repeat;
  background-size: cover;
`

const MoreCard = styled(classed.article`px-md pb-md text-center`)`
  flex-grow: 1;
  flex-basis: 0;

  ${ItemTitle} {
    padding: 1.5rem 0 2rem;
  }
`

const HomePage = () => {
  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG_LATEST)

  return (
    <Page>
      <Welcome>
        <p className="mb-4">
          Nosso trabalho é defender os direitos da classe trabalhadora.
        </p>
        <p className="mb-4">Ligue: (48) 3024-4166</p>
      </Welcome>

      <nav className="bg-button">
        <Container className="text-center">
          {expertises.map(({ id, href, label }) => (
            <Button as="a" key={id} href={href} title={label} alt={label}>
              {label}
            </Button>
          ))}
        </Container>
      </nav>

      <Section title="Blogue">
        {blog.data ? (
          <ul>
            {blog.data.blogs.map(post => (
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
              src="https://www.slpgadvogados.adv.br/sites/default/files/cnasp.jpg"
              alt="Logotipo do CNASP"
            />
            <ItemTitle>Atuação em outros estados da federação</ItemTitle>
            <Button as="a" href="/atuacao-em-outros-estados-da-federacao">
              Saiba Mais
            </Button>
          </MoreCard>

          <MoreCard>
            <img
              src="https://www.slpgadvogados.adv.br/sites/default/files/cnasp.jpg"
              alt="Logotipo do CNASP"
            />
            <ItemTitle>Atuação nos Tribunais Superiores</ItemTitle>
            <Button as="a" href="">
              Saiba Mais
            </Button>
          </MoreCard>

          <MoreCard>
            <img
              src="https://www.slpgadvogados.adv.br/sites/default/files/cnasp.jpg"
              alt="Logotipo do CNASP"
            />
            <ItemTitle>
              O Coletivo Nacional de Advogados de Servidores Públicos
            </ItemTitle>
            <Button as="a" href="">
              Saiba Mais
            </Button>
          </MoreCard>
        </div>
      </Section>
    </Page>
  )
}

export default withGraphQL(HomePage)
