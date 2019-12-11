import React from 'react'
import { styled, css, t } from '../lib/styled'
import { classed } from '../lib/classed'

type Props = React.ButtonHTMLAttributes<'button'> & {
  rel?: string
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
  secondary: css`
    color: ${t.theme('colors.text')};
    background-color: ${t.theme('backgroundColor.button-secondary')};

    &:hover,
    &:focus {
      color: ${t.theme('colors.primary')};
      background-color: ${t.theme(
        'backgroundColor.button-secondary--active'
      )} !important;
    }
  `,

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
    align-items: center;
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
      background-color: ${t.theme('colors.aside')} !important;
    }
  `,

  disabled: css`
    opacity: 0.5;
    pointer-events: none;
  `,
}

const Button = styled(
  classed.button<
    Props
  >`text-button bg-button hover:bg-button--active hover:text-button focus:bg-button--active focus:text-button`
)`
  display: inline-flex;
  padding: 1.175em 1.875em 1.05em;
  align-items: center;

  ${t.variants(variants)}
`

export { Button }
