import React from 'react'
import { Logo } from '~design'
import styled from 'styled-components'

const NavbarLogo = styled(Logo)`
  max-width: 252px;
`

const Header = () => (
  <header>
    <nav>
      <a href="/">
        <NavbarLogo />
      </a>
    </nav>
  </header>
)

export { Header }
