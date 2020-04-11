import React from 'react'
import * as Yup from 'yup'
import { useAlert } from 'react-alert'
import { useMutation } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { Button, Heading, AlertContent, styled } from '~design'
import { Page } from '~app/components/Page'
import { Section } from '~app/components/Section'
import { Input, FieldWrapper, useForm } from '~app/modules/form'
import { CONTACT } from './contact.gql'

const page = {
  title: 'Contato',
  description: 'Entre em contato e agende uma consulta',
}

const Map = styled.iframe.attrs({
  src:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.829957690526!2d-48.55102268497343!3d-27.598800982837005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738254a4b6e49%3A0xb0290625e1d82ca9!2sSLPG%20Advogados%20Associados!5e0!3m2!1spt-BR!2scz!4v1575744925010!5m2!1spt-BR!2scz',
  frameBorder: '0',
  allowFullScreen: true,
})`
  height: 400px;
  width: 100%;
`

const defaultValues = { name: '', phone: '', email: '', message: '' }

type Input = typeof defaultValues

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  message: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('E-mail invalido'),
})

const ContatoPage = () => {
  const alert = useAlert()

  const [contact] = useMutation<
    GT.CONTACT_MUTATION,
    GT.CONTACT_MUTATION_VARIABLES
  >(CONTACT)

  const form = useForm({ defaultValues, validationSchema })

  const fields = {
    name: form.field('name'),
    phone: form.field('phone'),
    email: form.field('email'),
    message: form.field('message'),
  }

  const onSubmit = form.handleSubmit(async variables => {
    try {
      await contact({ variables })

      form.reset()

      alert.success(
        <AlertContent title="Sucesso!">
          Formulário de contato enviado com sucesso
        </AlertContent>
      )
    } catch {
      alert.error(
        <AlertContent title="Não foi possível enviar o formulário">
          Tente novamente mais tarde
        </AlertContent>
      )
    }
  })

  return (
    <Page off={{ contactCTA: true }} meta={page}>
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

          <form onSubmit={onSubmit}>
            <FieldWrapper {...fields.name.meta}>
              <Input {...fields.name.input} placeholder="Nome" />
            </FieldWrapper>

            <FieldWrapper {...fields.phone.meta}>
              <Input {...fields.phone.input} placeholder="Telefone" />
            </FieldWrapper>

            <FieldWrapper {...fields.email.meta}>
              <Input {...fields.email.input} placeholder="E-mail" />
            </FieldWrapper>

            <FieldWrapper {...fields.message.meta}>
              <Input
                {...fields.message.input}
                as="textarea"
                rows={5}
                placeholder="Mensagem"
              />
            </FieldWrapper>

            <Button
              type="submit"
              className="w-full justify-center"
              disabled={form.formState.isSubmitting}
              loading={form.formState.isSubmitting}
              children="Enviar"
            />
          </form>
        </Section>

        <Section className="text-center lg:text-textual-title">
          <p>
            Rua Nunes Machado, 94 - 9º andar Centro, Florianópolis - Santa
            Catarina
          </p>

          <p className="font-bold mb-0">
            Telefone/FAX:{' '}
            <span className="block lg:inline">(48) 3024-4166</span>
          </p>
        </Section>

        <Map />
      </main>
    </Page>
  )
}

export default withGraphQL(ContatoPage)
