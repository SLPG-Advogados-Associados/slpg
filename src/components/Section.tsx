import React from 'react'

import { Container, Title, TextualTitle, styled, classed } from '~design'

type HTMLProps = React.HTMLAttributes<HTMLElement>

const SectionRaw: React.FC<Omit<HTMLProps, 'title'> & {
  title?: React.ReactNode
  textual?: boolean
}> = ({ children, title, textual, ...props }) => (
  <section {...props}>
    <Container>
      {title ? (
        <header className="mb-8">
          {textual ? (
            <TextualTitle>{title}</TextualTitle>
          ) : (
            <Title>{title}</Title>
          )}
        </header>
      ) : null}

      {children}
    </Container>
  </section>
)

const Section = styled(SectionRaw).attrs(
  classed('py-12 border-b border-divisor')
)``

export { Section }
