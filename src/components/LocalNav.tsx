import React from 'react'
import { Container, Button, t, styled, css } from '~design'

const primary = css`
  background-color: ${t.theme('backgroundColor.button')};

  ${Container} {
    border-top-color: ${t.theme('colors.reverse-border')};
  }
`

const StyledNav = styled.nav<{ primary?: boolean }>`
  background-color: ${t.theme('backgroundColor.button-secondary')};

  ${Container} {
    text-align: center;
    border-top: 2px solid ${t.theme('colors.border')};
    border-bottom: 1px solid ${t.theme('colors.border')};
  }

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

const LocalNavButton = styled(({ primary, ...props }) => (
  <Button secondary={!primary} {...props} asLink />
))`
  display: flex;
  justify-content: center;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: inline-flex;
  }
`

export { LocalNav, LocalNavButton }
