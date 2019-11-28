import React from 'react'
import { Container, classed } from '~design'

const Section = classed(({ children, ...props }) => (
  <section {...props}>
    <Container>{children}</Container>
  </section>
))`py-12 border-b border-divisor`

export { Section }
