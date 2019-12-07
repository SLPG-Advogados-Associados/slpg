import React from 'react'
import { withGraphQL } from '~api'
import { Page } from '~app/components/Page'
import { Heading, styled } from '~design'
import { Section } from '~app/components/Section'

const Map = styled.iframe.attrs({
  src:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.829957690526!2d-48.55102268497343!3d-27.598800982837005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738254a4b6e49%3A0xb0290625e1d82ca9!2sSLPG%20Advogados%20Associados!5e0!3m2!1spt-BR!2scz!4v1575744925010!5m2!1spt-BR!2scz',
  frameBorder: '0',
  allowFullScreen: true,
})`
  height: 400px;
  width: 100%;
`

const ContatoPage = () => {
  return (
    <Page>
      <div className="bg-reverse text-white py-8">
        <Heading noMargins>Contato</Heading>
      </div>

      <main>
        <Section title={'Entidades e sindicatos clientes'} textual>
          <p>
            Para o(a) trabalhador(a) filiado(a) as entidades e sindicatos que
            são nossos clientes, solicitamos que entre em contato exclusivamente
            através dos plantões que realizamos na sede da organizaçao a qual
            esteja filiado(a). Informe-se dos horários de atendimento com a
            secretaria da sua entidade.
          </p>
        </Section>

        <Section className="bg-aside" title={'Clientes particulares'} textual>
          <p>
            Se você é nosso cliente particular, ou se você ainda não é nosso
            cliente e gostaria de tirar dúvidas conosco sobre os serviços que
            prestamos, por favor, entre em contato agora mesmo através do
            formulário abaixo, ou pelo telefone <strong>(48) 3024-4166</strong>.
          </p>
        </Section>

        <Section className="text-center text-textual-title">
          <p>
            Rua Nunes Machado, 94 - 9º andar Centro, Florianópolis - Santa
            Catarina
          </p>

          <p className="font-bold mb-0">Telefone/FAX: (48) 3024-4166</p>
        </Section>

        <Map />
      </main>
    </Page>
  )
}

export default withGraphQL(ContatoPage)
