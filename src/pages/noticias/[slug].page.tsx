import React from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { Container, Title, Heading, Body, styled, t } from '~design'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { useRouter } from '~app/lib/router'
import { RequestError } from '~app/lib/errors'
import { BLOG_POST } from './post.gql'

const StyledTitle = styled(Title)`
  font-weight: normal;
  text-align: left;
  text-transform: none;
`

const ImageWrapper = styled.div`
  margin: 1rem 0 2rem;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    float: left;
    margin: 0 2rem 2rem 0;
    max-width: 50%;
  }
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
  const { query: variables } = useRouter<{ slug: string }>()

  const { data } = useQuery<GT.BLOG_POST_QUERY>(BLOG_POST, {
    variables,
  })

  let meta = {}
  let body: React.ReactNode | null = null

  if (data) {
    const post = data.post

    if (!post) {
      throw new RequestError(
        `Could not find post with slug ${variables.slug}`,
        404
      )
    }

    const date = dayjs(post.date)

    meta = {
      title: post.title,
      description: post.summary,
      image: post.image ? post.image.url : null,
      others: (
        <>
          <meta property="og:updated_time" content={post.date} />,
          <meta property="article:published_time" content={post.date} />,
          <meta property="article:modified_time" content={post.date} />,
        </>
      ),
    }

    body = (
      <Section>
        <Container as="main" className="clear">
          <header className="border-b pb-2 mb-2 lg:mb-8">
            <StyledTitle className="mb-0">{post.title}</StyledTitle>
            <time
              dateTime={date.toISOString()}
              className="italic text-silent text-meta"
            >
              {date.format('DD/MM/YYYY')}
            </time>
          </header>

          {post.image ? (
            <ImageWrapper>
              <img src={post.image.url} />
            </ImageWrapper>
          ) : null}

          <Body content={post.body} />
        </Container>
      </Section>
    )
  }

  return (
    <Page meta={meta} prefixTitle={false}>
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
