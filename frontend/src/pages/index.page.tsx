import React from 'react'
import styled from 'styled-components'
import { theme } from 'styled-tools'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container, Heading, Button } from '~design'
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

      <Container>
        <Heading>Blogue</Heading>

        {blog.data ? (
          <ul>
            {blog.data.blogs.map(post => (
              <li key={post.id} className="py-lg border-b-2">
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </Page>
  )
}

export default withGraphQL(HomePage)
