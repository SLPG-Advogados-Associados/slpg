import React from 'react'
import { styled, t, Logo, Container } from '~design'
import { MainMenu } from './MainMenu'

const NavbarLogo = styled(Logo)`
  max-width: 180px;
  margin: 12px 0;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    max-width: 252px;
  }
`

const Header = () => (
  <header className="bg-white relative z-10">
    <Container className="flex" fullOnMobile>
      <a href="/" title="Início">
        <NavbarLogo />
      </a>

      <nav className="ml-auto flex items-center">
        <MainMenu />
      </nav>
    </Container>
  </header>
)

export { Header }
