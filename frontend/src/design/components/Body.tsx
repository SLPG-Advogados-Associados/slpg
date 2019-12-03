import React from 'react'
import Markdown from 'react-markdown'
import { HTMLContent } from './HTMLContent'

const Body: React.FC<{ content: string }> = ({ content, ...props }) => (
  <HTMLContent {...props}>
    <Markdown source={content} />
  </HTMLContent>
)

export { Body }
