import React from 'react'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container, Title } from '~design'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_POST } from './post.gql'
import { useRouter } from '~app/lib/router'

const PostPage = () => {
  const { query: variables } = useRouter<{ post: string }>()
  const { data } = useQuery<GT.BLOG_POST_QUERY>(BLOG_POST, { variables })

  const post = data && data.post

  return (
    <Page>
      {post ? (
        <Container>
          <Title>{post.title}</Title>

          <div>{post.body}</div>
        </Container>
      ) : null}
    </Page>
  )
}

export default withGraphQL(PostPage)
