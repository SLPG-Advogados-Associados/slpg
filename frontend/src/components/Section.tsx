import React from 'react'
import { Container, Title, TextualTitle, classed } from '~design'

type HTMLProps = React.HTMLAttributes<HTMLElement>

const SectionRaw: React.FC<{
  title?: React.ReactNode
  textual?: boolean
} & HTMLProps> = ({ children, title, textual, ...props }) => (
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

const Section = classed(SectionRaw)`py-12 border-b border-divisor`

export { Section }
