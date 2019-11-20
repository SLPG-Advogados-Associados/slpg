import React from 'react'
import dayjs from 'dayjs'

const PostListItem = ({ post }) => {
  const date = dayjs(post.created_at)

  return (
    <a href="" className="block">
      <article className="flex">
        <aside className="w-32 pt-10 text-aside text-center text-primary uppercase">
          <div>{date.format('MMM')}</div>
          <div>{date.format('DD')}</div>
        </aside>

        <div>
          <h3 className="text-item-title font-semibold pb-2">{post.title}</h3>

          <p>{post.summary}</p>
        </div>
      </article>
    </a>
  )
}

export { PostListItem }
