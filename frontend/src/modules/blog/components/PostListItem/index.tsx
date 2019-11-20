import React from 'react'
import dayjs from 'dayjs'
import { ItemTitle } from '~design'

const PostListItem = ({ post }) => {
  const date = dayjs(post.created_at)

  return (
    <a href="" className="block">
      <article className="flex">
        <aside className="w-32 pt-10 text-aside text-center text-primary uppercase flex-shrink-0">
          <div>{date.format('MMM')}</div>
          <div>{date.format('DD')}</div>
        </aside>

        <div>
          <ItemTitle>{post.title}</ItemTitle>

          <p>{post.summary}</p>
        </div>
      </article>
    </a>
  )
}

export { PostListItem }
