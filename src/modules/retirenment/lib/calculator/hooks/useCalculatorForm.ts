import * as Yup from 'yup'
import { useForm, schemas } from '~modules/form'
import { Gender, Contribution } from '../types'

type FormData = {
  gender: Gender
  birthDate: Date
  contributions: Contribution[]
}

const validationSchema = Yup.object().shape({
  gender: Yup.string().required('Campo obrigatório'),
  birthDate: schemas
    .date()
    .required('Campo obrigatório')
    .typeError('"${originalValue}" não é uma data válida'),
})

const useCalculatorForm = () => {
  const form = useForm<FormData>({ validationSchema })

  const fields = {
    gender: form.useField('gender'),
    birthDate: form.useField('birthDate'),
    contributions: form.useFieldArray('contributions', path => ({
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
