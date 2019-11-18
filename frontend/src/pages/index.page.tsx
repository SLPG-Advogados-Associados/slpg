import React from 'react'
import dayjs from 'dayjs'
import { Page } from '~app/components/Page'
import { withGraphQL, GT } from '~api'
import { Container } from '~design'
import { useQuery } from '@apollo/react-hooks'
import { BLOG_LATEST } from './index.gql'

const HomePage = () => {
  const blog = useQuery<GT.BLOG_LATEST_QUERY>(BLOG_LATEST)

  return (
    <Page>
      <Container>
        <h2>Blogue</h2>

        {blog.data ? (
          <ul>
            {blog.data.blogs.map(post => {
              const date = dayjs('2019-04-03')

              return (
                <li key={post.id} className="py-lg border-b-2">
                  <article className="flex">
                    <aside className="w-32 pt-10 text-aside text-center text-primary uppercase">
                      <div>{date.format('MMM')}</div>
                      <div>{date.format('DD')}</div>
                    </aside>

                    <div>
                      <h3 className="text-item-title font-semibold pb-2">
                        {post.title}
                      </h3>

                      <p>{post.summary}</p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : null}
      </Container>
    </Page>
  )
}

export default withGraphQL(HomePage)
