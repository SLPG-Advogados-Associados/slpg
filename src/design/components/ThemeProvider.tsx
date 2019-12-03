import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from '../theme'
import '../base.css'

const ThemeProvider: React.FC = ({ children }) => (
  <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
)

export { ThemeProvider }
