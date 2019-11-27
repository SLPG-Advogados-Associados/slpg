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
  display: inline-block;
  padding: 1.175em 1.875em 1.05em;
`

export { Button }
