import React from 'react'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container, Heading } from '~design'
import { PostListItem } from '~modules/blog'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_LATEST } from './index.gql'

const HomePage = () => {
  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG_LATEST)

  return (
    <Page>
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
