import React from 'react'
import { transitions, positions, Provider } from 'react-alert'
import AlertTemplateBasic from 'react-alert-template-basic'
import { styled, t } from '../lib/styled'

const WrappingStyles = styled.div`
  > div {
    background-color: white !important;
    border: 1px solid ${t.theme('colors.border')} !important;
    color: inherit !important;
    text-transform: none !important;
    width: auto !important;
    max-width: 32rem !important;

    > button > svg {
      stroke: ${t.theme('colors.primary')} !important;

      &:hover,
      &:focus {
        opacity: 0.75;
      }
    }
  }

  .title {
    font-weight: bold;
  }
`

const Template = props => (
  <WrappingStyles>
    <AlertTemplateBasic {...props} />
  </WrappingStyles>
)

const AlertProvider: React.FC = ({ children }) => (
  <Provider
    template={Template}
    position={positions.TOP_RIGHT}
    timeout={5000}
    offset={'2rem'}
    transition={transitions.FADE}
  >
    {children}
  </Provider>
)

export { AlertProvider }
