import React from 'react'
import { styled, css, t } from '../lib/styled'
import { classed } from '../lib/classed'

interface Props {
  alt?: string
  href?: string
  title?: string
  target?: string
  // variants
  small?: boolean
  cta?: boolean
  circle?: boolean
}

const small = css`
  font-size: 0.95em;
`

const big = css`
  font-size: 1.25em;
`

const cta = css`
  border: 0.1em solid white;
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
  classed.button`text-button bg-button hover:bg-button--active hover:text-button focus:bg-button--active focus:text-button` as React.FC<
    Props
  >
)`
  display: inline-flex;
  padding: 1.175em 1.875em 1.05em;

  ${t.variants({ small, big, cta, circle })}
`

export { Button }
