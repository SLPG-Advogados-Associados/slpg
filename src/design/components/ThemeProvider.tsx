import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from '../theme'
import '../base.css'
import { AlertProvider } from './AlertProvider'

const ThemeProvider: React.FC = ({ children }) => (
  <StyledThemeProvider theme={theme}>
    <AlertProvider>{children}</AlertProvider>
  </StyledThemeProvider>
)

export { ThemeProvider }
