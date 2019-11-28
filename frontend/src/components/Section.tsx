import React from 'react'
import { Container, Title, classed } from '~design'

type HTMLProps = React.HTMLAttributes<HTMLElement>

const SectionRaw: React.FC<{ title?: string } & HTMLProps> = ({
  children,
  title,
  ...props
}) => (
  <section {...props}>
    <Container>
      {title ? (
        <header className="mb-8">
          <Title>{title}</Title>
        </header>
      ) : null}

      {children}
    </Container>
  </section>
)

const Section = classed(SectionRaw)`py-12 border-b border-divisor`

export { Section }
