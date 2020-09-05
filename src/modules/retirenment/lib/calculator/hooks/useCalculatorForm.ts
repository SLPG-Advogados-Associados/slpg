import * as Yup from 'yup'
import { useForm, schemas } from '~modules/form'
import { Sex, Contribution } from '../types'

type FormData = {
  sex: Sex
  birthDate: Date
  contributions: Contribution[]
}

const date = schemas
  .date()
  .required('Campo obrigatório')
  .typeError('"${originalValue}" não é uma data válida')

const validationSchema = Yup.object().shape({
  sex: Yup.string().required('Campo obrigatório'),
  birthDate: date,
  contributions: Yup.array().of(
    Yup.object().shape({
      start: date,
      end: date.notRequired(),
      service: Yup.object().shape({
        title: Yup.string(),
        kind: Yup.string().required('Campo obrigatório'),
        post: Yup.string().required('Campo obrigatório'),
      }),
    })
  ),
})

const useCalculatorForm = () => {
  const form = useForm<FormData>({ validationSchema })

  const fields = {
    sex: form.useField('sex'),
    birthDate: form.useField('birthDate'),
    contributions: form.useFieldArray('contributions', (path) => ({
      start: form.useField(`${path}.start`, true),
      end: form.useField(`${path}.end`, true),
      salary: form.useField(`${path}.salary`, true),
      service: {
        title: form.useField(`${path}.service.title`, true),
        kind: form.useField(`${path}.service.kind`, true),
        post: form.useField(`${path}.service.post`, true),
      },
    })),
  }

  if (fields.contributions.items.length === 0) {
    fields.contributions.append({})
  }

  return { ...form, fields }
}

export { useCalculatorForm }
