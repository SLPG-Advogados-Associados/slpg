import React from 'react'
import styled from 'styled-components'
import { Logo, Container } from '~design'
import { MainMenu } from './MainMenu'

const NavbarLogo = styled(Logo)`
  max-width: 252px;
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
