import React from 'react'
import Markdown, { renderers } from 'react-markdown'
import { HTMLContent } from './HTMLContent'
import parse from 'url-parse'
import ReactPlayer from 'react-player'
import styled from 'styled-components'

const Player = styled(ReactPlayer)`
  margin: 2em auto 2em;
`

const custom: { [key: string]: React.FC<{ value: string }> } = {
  youtube({ value }) {
    return <Player url={value} />
  },
}

const code: React.FC<{ language?: string; value: string }> = props =>
  custom[props.language]
    ? custom[props.language](props)
    : (renderers.code as Function)(props)

// Netlify environment holds a `URL` env for the target origin.
const origin =
  process.env.URL || (process.browser ? window.location.origin : '')

// Use `_blank` for external links.
const linkTarget = (url: string) =>
  parse(url, origin).origin === origin ? '_self' : '_blank'

const Body: React.FC<{ content: string }> = ({ content, ...props }) => (
  <HTMLContent {...props}>
    <Markdown source={content} linkTarget={linkTarget} renderers={{ code }} />
  </HTMLContent>
)

export { Body }
