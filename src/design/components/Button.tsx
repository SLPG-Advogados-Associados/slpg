import React from 'react'
import BounceLoader from 'react-spinners/BounceLoader'
import { styled, css, t } from '../lib/styled'
import { classed } from '../lib/classed-str'
import { theme } from '../theme'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rel?: string
  alt?: string
  href?: string
  title?: string
  target?: string
  // variants
  asLink?: boolean
  small?: boolean
  big?: boolean
  cta?: boolean
  circle?: boolean
  outline?: boolean
  // states
  loading?: boolean
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

const Styled = styled.button<Props>`
  display: inline-flex;
  padding: 1.175em 1.875em 1.05em;
  align-items: center;

  ${t.variants(variants)}
`

const Base: React.FC<Props> = ({ children, loading, asLink, ...props }) => (
  // @ts-ignore
  <Styled {...props} as={asLink ? 'a' : undefined}>
    {loading ? <BounceLoader color={theme.colors.white} size={24} /> : children}
  </Styled>
)

const Button = styled(Base).attrs(
  classed<
    Props
  >`text-button bg-button hover:bg-button--active hover:text-button focus:bg-button--active focus:text-button`
)``

export { Button }
