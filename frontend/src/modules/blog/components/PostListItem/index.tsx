import React from 'react'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { ItemTitle } from '~design'

const Anchor = styled.a`
  &:hover,
  &:focus {
    opacity: 0.7;
  }
`

const PostListItem = ({ post }) => {
  const date = dayjs(post.created_at)

  return (
    <Anchor href={`/post/${post.id}`} className="block">
      <article className="flex">
        <aside className="w-32 mr-12 pt-4 text-aside text-center text-primary uppercase flex-shrink-0">
          <div>{date.format('MMM')}</div>
          <div>{date.format('DD')}</div>
        </aside>

        <div>
          <ItemTitle>{post.title}</ItemTitle>

          <p>{post.summary}</p>
        </div>
      </article>
    </Anchor>
  )
}

export { PostListItem }
