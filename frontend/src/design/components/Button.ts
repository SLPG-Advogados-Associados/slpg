import React from 'react'
import { styled, css, t } from '../lib/styled'
import { classed } from '../lib/classed'

type Props = React.ButtonHTMLAttributes<'button'> & {
  alt?: string
  href?: string
  title?: string
  target?: string
  // variants
  small?: boolean
  big?: boolean
  cta?: boolean
  circle?: boolean
  outline?: boolean
}

const variants = {
  small: css`
    font-size: 0.95em;
  `,

  big: css`
    font-size: 1.25em;
  `,

  cta: css`
    border: 0.1em solid white;
  `,

  circle: css`
    display: inline-flex;
    justify-content: center;
    height: 3.653em;
    width: 3.653em;
    padding: 0;
    border-radius: 50%;
  `,

  outline: css`
    color: ${t.theme('colors.primary')};
    background-color: ${t.theme('colors.white')} !important;
    border: 0.1em solid ${t.theme('colors.border')};

    &:hover,
    &:focus {
      color: ${t.theme('colors.primary')};
      background-color: ${t.theme('colors.silent')} !important;
    }
  `,
}

const Button = styled(
  classed.button`text-button bg-button hover:bg-button--active hover:text-button focus:bg-button--active focus:text-button` as React.FC<
    Props
  >
)`
  display: inline-flex;
  padding: 1.175em 1.875em 1.05em;

  ${t.variants(variants)}
`

export { Button }
