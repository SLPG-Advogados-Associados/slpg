import React from 'react'
import * as Yup from 'yup'
import { Formik, FormikProps } from 'formik'
import BounceLoader from 'react-spinners/BounceLoader'
import { useMutation } from '@apollo/react-hooks'
import { withGraphQL, GT } from '~api'
import { Page } from '~app/components/Page'
import { Button, Heading, styled, t, theme } from '~design'
import { Section } from '~app/components/Section'
import { CONTACT } from './contact.gql'

const Map = styled.iframe.attrs({
  src:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.829957690526!2d-48.55102268497343!3d-27.598800982837005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952738254a4b6e49%3A0xb0290625e1d82ca9!2sSLPG%20Advogados%20Associados!5e0!3m2!1spt-BR!2scz!4v1575744925010!5m2!1spt-BR!2scz',
  frameBorder: '0',
  allowFullScreen: true,
})`
  height: 400px;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  padding: 0.85em 1em;
  color: inherit;
  border: 1px solid ${t.theme('colors.border')};
  font-size: ${t.theme('fontSize.200')};
`

const TextArea = Input.withComponent('textarea')

const Error: React.FC<{ error?: string }> = ({ error }) =>
  error ? (
    <span className="text-meta text-danger block p-2">{error}</span>
  ) : null

const initialValues = { name: '', phone: '', email: '', message: '' }

type Inputs = typeof initialValues

const input = (name: keyof Inputs, form: FormikProps<Inputs>) => ({
  name,
  value: form.values[name],
  onChange: form.handleChange,
  onBlur: form.handleBlur,
})

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  message: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('E-mail invalido'),
})

const ContatoPage = () => {
  const [contact] = useMutation<
    GT.CONTACT_MUTATION,
    GT.CONTACT_MUTATION_VARIABLES
  >(CONTACT)

  const onSubmit = (variables: Inputs) => contact({ variables })

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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {form => (
              <form onSubmit={form.handleSubmit}>
                <label className="mb-4 block">
                  <Input {...input('name', form)} placeholder="Nome" />
                  <Error error={form.touched.name && form.errors.name} />
                </label>

                <label className="mb-4 block">
                  <Input {...input('phone', form)} placeholder="Telefone" />
                  <Error error={form.touched.name && form.errors.phone} />
                </label>

                <label className="mb-4 block">
                  <Input {...input('email', form)} placeholder="E-mail" />
                  <Error error={form.touched.name && form.errors.email} />
                </label>

                <label className="mb-4 block">
                  <TextArea
                    {...input('message', form)}
                    placeholder="Mensagem"
                    rows={5}
                  />
                  <Error error={form.touched.name && form.errors.message} />
                </label>

                <Button
                  type="submit"
                  className="w-full justify-center"
                  disabled={form.isSubmitting}
                >
                  {form.isSubmitting ? (
                    <BounceLoader color={theme.colors.white} size={24} />
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </form>
            )}
          </Formik>
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
