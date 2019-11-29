import React from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { Container, Title, Heading, HTMLContent, styled } from '~design'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { useRouter } from '~app/lib/router'
import { BLOG_POST } from './post.gql'

const StyledTitle = styled(Title)`
  font-weight: normal;
  text-align: left;
  text-transform: none;
`

const Image = styled.img`
  display: inline-block;
  max-height: 40vh;
  max-width: 50vw;
  margin: 2rem 0 3rem;
`

const BlogueAnchor = styled.a`
  display: block;
  color: inherit;

  &:hover,
  &:focus {
    color: inherit;
    opacity: 0.7;
  }
`

const PostPage = () => {
  const { query: variables } = useRouter<{ post: string }>()
  const { data } = useQuery<GT.BLOG_POST_QUERY>(BLOG_POST, { variables })

  let body: React.ReactNode | null = null

  if (data) {
    const post = data.post
    const date = dayjs(post.created_at)

    body = (
      <Section>
        <Container as="main">
          <header className="border-b pb-2 mb-8">
            <StyledTitle className="mb-0">{post.title}</StyledTitle>
            <time
              dateTime={date.toISOString()}
              className="italic text-silent text-meta"
            >
              {date.format('DD/MM/YYYY')}
            </time>
          </header>

          {post.image ? (
            <div className="text-center">
              <Image src={'http://localhost:1337' + post.image.url} />
            </div>
          ) : null}

          <HTMLContent>{post.body}</HTMLContent>
        </Container>
      </Section>
    )
  }

  return (
    <Page>
      <div className="bg-reverse text-white py-8">
        <BlogueAnchor href="/blogue">
          <Heading noMargins>Blogue</Heading>
        </BlogueAnchor>
      </div>

      {body}
    </Page>
  )
}

export default withGraphQL(PostPage)
