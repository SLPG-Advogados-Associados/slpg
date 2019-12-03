import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { GT } from '~api'
import { ItemTitle } from '~design'

const Anchor = styled.a`
  &:hover,
  &:focus {
    opacity: 0.7;
  }
`

const PostListItem: React.FC<{
  post: GT.PostListItemFragment
  noImage?: boolean
}> = ({ post, noImage }) => {
  const date = dayjs(post.date)

  return (
    <Anchor href={`/noticias/${post.slug}`} className="block">
      <article className="flex">
        <aside className="w-32 mr-12 pt-4 text-aside-title text-center text-primary uppercase flex-shrink-0">
          <div>{date.format('MMM')}</div>
          <div>{date.format('DD')}</div>
        </aside>

        {post.image && !noImage ? (
          <aside className="w-48 mr-8 flex-shrink-0">
            <img src={post.image.url} />
          </aside>
        ) : null}

        <div>
          <ItemTitle>{post.title}</ItemTitle>

          <p>{post.summary}</p>
        </div>
      </article>
    </Anchor>
  )
}

export { PostListItem }
