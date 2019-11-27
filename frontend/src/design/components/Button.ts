import React from 'react'
import styled from 'styled-components'
import * as classed from '../lib/classed-tags'

const Button = styled(
  classed.button`text-button bg-button hover:bg-button:active` as React.FC<{
    alt?: string
    href?: string
    title?: string
    target?: string
  }>
)`
  display: block;
  padding: 1.375em 1.875em 1.25em 1.875em;
`

export { Button }
