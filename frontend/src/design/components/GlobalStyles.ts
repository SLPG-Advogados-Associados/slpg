import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,400i,700,700i&display=swap');

  html, body {
    font-size: 16px;
    font-family: 'montserrat', sans-serif;
    color: #7F7F7F;
  }
`

export { GlobalStyles }
