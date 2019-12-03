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

const PageButton = styled(Button).attrs({ small: true, outline: true })`
  margin: 0 0.5em;
`

const BloguePage = () => {
  const limit = 6 // same as on next.export.js
  const router = useRouter<{ page: string }>()

  const page = Number(router.query.page || 0)
  const variables = { limit: limit + 1, start: limit * page }

  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG, { variables })
  const hasNext = blog.data && blog.data.posts.length > 6

  const goToPage = (to: number) => router.push(`/blogue${to ? `/${to}` : ''}`)

  return (
    <Page>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Blogue</Heading>
      </div>

      <Section>
        {blog.data ? (
          <ul>
            {blog.data.posts.slice(0, 6).map(post => (
              <li key={post.id} className="py-lg border-b-2">
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        ) : null}

        <footer className="my-20 flex justify-center">
          {page > 0 ? (
            <PageButton onClick={() => goToPage(page - 1)}>
              <Icons.ArrowLeft className="mr-2" />
              Anterior
            </PageButton>
          ) : null}

          {page > 0 ? (
            <PageButton onClick={() => goToPage(0)}>Início</PageButton>
          ) : null}

          {hasNext ? (
            <PageButton onClick={() => goToPage(page + 1)}>
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
