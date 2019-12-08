import React from 'react'
import { Container, Button, t, styled, classnames } from '~design'

const LocalNav: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <nav className={classnames('bg-button', className)}>
    <Container
      className="text-center border-t-2 border-reverse-border"
      fullOnMobile
    >
      {children}
    </Container>
  </nav>
)

const LocalNavButton = styled(Button.withComponent('a'))`
  display: flex;
  justify-content: center;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    display: inline-flex;
  }
`

export { LocalNav, LocalNavButton }
