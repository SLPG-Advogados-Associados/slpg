import React from 'react'
import Markdown from 'react-markdown'
import { HTMLContent } from './HTMLContent'
import parse from 'url-parse'

// Netlify environment holds a `URL` env for the target origin.
const origin =
  process.env.URL || (process.browser ? window.location.origin : '')

// Use `_blank` for external links.
const linkTarget = (url: string) =>
  parse(url, origin).origin === origin ? '_self' : '_blank'

const Body: React.FC<{ content: string }> = ({ content, ...props }) => (
  <HTMLContent {...props}>
    <Markdown source={content} linkTarget={linkTarget} />
  </HTMLContent>
)

export { Body }
