import React from 'react'
import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'
import * as classed from '../lib/classed-tags'

interface Props {
  alt?: string
  href?: string
  title?: string
  target?: string
  // variants
  small?: boolean
  circle?: boolean
}

const small = css`
  font-size: 0.95em;
`

const circle = css`
  display: inline-flex;
  justify-content: center;
  height: 3.653em;
  width: 3.653em;
  padding: 0;
  border-radius: 50%;
`

const Button = styled(
  classed.button`text-button bg-button hover:bg-button--active` as React.FC<
    Props
  >
)`
  display: inline-block;
  padding: 1.175em 1.875em 1.05em;

  ${ifProp('small', small)}
  ${ifProp('circle', circle)}
`

export { Button }
