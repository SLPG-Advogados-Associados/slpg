import React from 'react'
import { Container, Button, t, styled, css } from '~design'

const primary = css`
  background-color: ${t.theme('backgroundColor.button')};
  border-top-color: ${t.theme('colors.reverse-border')};
`

const StyledNav = styled.nav<{ primary?: boolean }>`
  background-color: ${t.theme('backgroundColor.button-secondary')};

  border-top: 2px solid ${t.theme('colors.border')};
  border-bottom: 1px solid ${t.theme('colors.border')};
  text-align: center;

  ${t.ifProp('primary', primary)}
`

const LocalNav: React.FC<{ primary?: boolean; className?: string }> = ({
  primary,
  children,
  className,
}) => (
  <StyledNav className={className} primary={primary}>
    <Container fullOnMobile>{children}</Container>
  </StyledNav>
)

const LocalNavButton = styled(Button).attrs(({ primary }) => ({
  secondary: !primary,
  as: 'a',
}))`
  display: flex;
  justify-content: center;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: inline-flex;
  }
`

export { LocalNav, LocalNavButton }
