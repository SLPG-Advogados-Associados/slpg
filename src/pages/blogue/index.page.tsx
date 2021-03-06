import React from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { Heading, Button, Icons } from '~design'
import { PostListItem } from '~modules/blog'
import { useRouter } from '~app/lib/router'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { BLOG } from './blogue.gql'

const PageButton = styled(Button.withComponent('a')).attrs({
  small: true,
  outline: true,
})`
  margin: 0 0.5em;
`

const BloguePage = () => {
  const limit = 6 // same as on next.export.js
  const router = useRouter<{ page: string }>()

  const page = Number(router.query.page || 0)
  const variables = { limit: limit + 1, start: limit * page }

  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG, { variables })
  const posts = blog.data ? blog.data.posts.items.map(({ item }) => item) : []
  const hasNext = posts.length > 6

  const pagePath = (to: number) => `/blogue${to ? `/${to}` : ''}`

  return (
    <Page
      meta={{
        title: 'Blogue',
        description: 'Notícias e informativos sobre os seus direitos.',
      }}
    >
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Blogue</Heading>
      </div>

      <Section>
        {blog.data ? (
          <ul>
            {posts.slice(0, 6).map(post => (
              <li key={post.id} className="py-lg border-b-2">
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="my-20 flex justify-center">
          {page > 0 ? (
            <PageButton href={pagePath(page - 1)}>
              <Icons.ArrowLeft className="mr-2" />
              Anterior
            </PageButton>
          ) : null}

          {page > 0 ? <PageButton href={pagePath(0)}>Início</PageButton> : null}

          {hasNext ? (
            <PageButton href={pagePath(page + 1)}>
              Próximo
              <Icons.ArrowRight className="ml-2" />
            </PageButton>
          ) : null}
        </footer>
      </Section>
    </Page>
  )
}

export default withGraphQL(BloguePage)
