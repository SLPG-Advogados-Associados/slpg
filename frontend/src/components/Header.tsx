import React from 'react'
import { Logo, Container } from '~design'
import styled from 'styled-components'

const NavbarLogo = styled(Logo)`
  max-width: 252px;
`

const HeaderContainer = Container.withComponent('header')

const Header = () => (
  <HeaderContainer>
    <nav>
      <a href="/" title="Início">
        <NavbarLogo />
      </a>
    </nav>
  </HeaderContainer>
)

export { Header }
