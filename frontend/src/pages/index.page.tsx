import React from 'react'
import styled from 'styled-components'
import { theme } from 'styled-tools'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container, Heading } from '~design'
import { PostListItem } from '~modules/blog'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_LATEST } from './index.gql'

const Header = styled.div`
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
      <Header>
        <p className="mb-4">
          Nosso trabalho é defender os direitos da classe trabalhadora.
        </p>
        <p className="mb-4">Ligue: (48) 3024-4166</p>
      </Header>

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
