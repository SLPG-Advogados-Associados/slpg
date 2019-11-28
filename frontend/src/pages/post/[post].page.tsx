import React from 'react'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container, Title, Heading, styled } from '~design'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_POST } from './post.gql'
import { useRouter } from '~app/lib/router'

const StyledHeading = styled(Heading)`
  margin: 0;
`

const Image = styled.img`
  display: inline-block;
  max-height: 40vh;
  max-width: 50vw;
  margin: 2rem 0 3rem;
`

const PostPage = () => {
  const { query: variables } = useRouter<{ post: string }>()
  const { data } = useQuery<GT.BLOG_POST_QUERY>(BLOG_POST, { variables })

  const post = data && data.post

  return (
    <Page>
      <div className="bg-reverse text-white py-8">
        <StyledHeading>Blogue</StyledHeading>
      </div>

      {post ? (
        <Container className="py-12">
          <Title>{post.title}</Title>

          {post.image ? (
            <div className="text-center">
              <Image src={'http://localhost:1337' + post.image.url} />
            </div>
          ) : null}

          <div>{post.body}</div>
        </Container>
      ) : null}
    </Page>
  )
}

export default withGraphQL(PostPage)
