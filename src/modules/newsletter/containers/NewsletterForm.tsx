import React from 'react'
import * as Yup from 'yup'
import BounceLoader from 'react-spinners/BounceLoader'
import BeatLoader from 'react-spinners/BeatLoader'
import { useAlert } from 'react-alert'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { GT } from '~api'
import { Button, AlertContent, theme } from '~design'
import { Input, FieldWrapper, useForm } from '~app/modules/form'
import { NEWSLETTER_INTERESTS, SUBSCRIBE } from './newsletter.gql'

type Inputs = { email: string; name: string; interests: string[] }

const defaultValues: Inputs = {
  email: '',
  name: '',
  interests: [],
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Campo obrigatório')
    .email('E-mail invalido'),
  name: Yup.string().required('Campo obrigatório'),
})

const NewsletterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const alert = useAlert()

  const [subscribe] = useMutation<
    GT.SUBSCRIBE_MUTATION,
    GT.SUBSCRIBE_MUTATION_VARIABLES
  >(SUBSCRIBE)

  const { data, loading, error } = useQuery<GT.NEWSLETTER_INTERESTS_QUERY>(
    NEWSLETTER_INTERESTS
  )

  const form = useForm<Inputs>({ defaultValues, validationSchema })

  const fields = {
    email: form.field('email'),
    name: form.field('name'),
    interests: form.field('interests'),
  }

  const onSubmit = form.handleSubmit(async variables => {
    try {
      await subscribe({ variables })

      form.reset()

      alert.success(
        <AlertContent title="Sucesso!">
          Inscrição realizada com sucesso
        </AlertContent>
      )

      onSuccess()
    } catch {
      alert.error(
        <AlertContent title="Não foi increver-se no momento">
          Tente novamente mais tarde
        </AlertContent>
      )
    }
  })

  if (error) throw error

  if (loading) {
    return (
      <div className="py-10 px-16">
        <BeatLoader color={theme.colors.primary} size={12} />
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="p-12">
      <h2 className="font-bold mb-4 text-secondary-title">
        Inscreva-se para receber nossos e-mails informativos
      </h2>

      <label className="mb-4 block">
        <div className="font-bold mb-2">E-mail</div>
        <FieldWrapper {...fields.email.meta}>
          <Input {...fields.email.input} />
        </FieldWrapper>
      </label>

      <label className="mb-4 block">
        <div className="font-bold mb-2">Nome</div>
        <FieldWrapper {...fields.name.meta}>
          <Input {...fields.name.input} />
        </FieldWrapper>
      </label>

      <div className="mb-10">
        <h3 className="font-bold mb-2">Áreas de seu interesse:</h3>

        {data.interests.map(({ id, name }) => (
          <label key={id} className="mb-4 block">
            <input type="checkbox" value={id} {...fields.interests.input} />{' '}
            {name}
          </label>
        ))}
      </div>

      <Button
        type="submit"
        className="justify-center"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <BounceLoader color={theme.colors.white} size={24} />
        ) : (
          'Inscreva-se'
        )}
      </Button>
    </form>
  )
}

export { NewsletterForm }
