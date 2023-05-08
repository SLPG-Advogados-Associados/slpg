import React from 'react'
import { styled } from '~design'
import { WhatsApp as Icon } from './whats-app-icon'

const openWhatsApp = () => window.open('https://wa.me/554830244166', '_blank')

const Anchor = styled.a`
  color: inherit;
  text-decoration: underline;

  &:hover,
  &:focus {
    opacity: 0.8;
    color: inherit;
  }
`

const Phone = () => (
  <>
    <Anchor href="tel:+554830244166">(48) 3024-4166</Anchor>{' '}
    <Anchor href="#" onClick={openWhatsApp}>
      <Icon className="inline-block align-text-top" />
    </Anchor>
  </>
)

export { Phone }
