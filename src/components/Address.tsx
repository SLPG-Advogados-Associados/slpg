import React from 'react'
import { styled, t } from '~design'

const Container = styled.div`
  > span {
    display: block;
    line-height: 2em;
  }

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    > span {
      display: inline;
    }

    > span:not(:last-child):after {
      content: ' – ';
      display: inline;
    }
  }
`

const Address: React.FC = ({ children }) => (
  <Container>
    <span>Florianópolis/SC</span>
    <span>Rua Nunes Machado, ed. Tiradentes, nº 94, 9º andar</span>
    <span>CEP: 88010-460</span>
    {children}
  </Container>
)

export { Address }
