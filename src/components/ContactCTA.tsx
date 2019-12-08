import React from 'react'
import { Container, Button, Icons } from '~design'

const ContactCTA = () => (
  <div className="bg-reverse text-white text-center pt-10 pb-12">
    <Container>
      <p className="text-800">Alguma dúvida sobre seus direitos?</p>
      <Button as="a" href="/contato" big cta>
        Entre em contato <Icons.ArrowRight className="ml-2" />
      </Button>
    </Container>
  </div>
)

export { ContactCTA }
