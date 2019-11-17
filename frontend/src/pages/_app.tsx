import React from 'react'
import NextApp from 'next/app'
import { ThemeProvider } from '~design'

const App: React.FC<React.ComponentProps<typeof NextApp>> = props => (
  <ThemeProvider>
    <NextApp {...props} />
  </ThemeProvider>
)

export default App
