import { useForm } from 'react-hook-form'
import * as S from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Sex, Contribution } from '../types'

type FormData = {
  sex: Sex
  birthDate: Date
  contributions: Contribution[]
}

const date = S.date()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr))
  .required('Campo obrigatório')
  .typeError('"${originalValue}" não é uma data válida')

const schema = S.object().shape({
  sex: S.string().required('Campo obrigatório'),
  birthDate: date,
  contributions: S.array().of(
    S.object().shape({
      start: date,
      end: date.notRequired(),
      service: S.object().shape({
        title: S.string(),
        kind: S.string().required('Campo obrigatório'),
        post: S.string().required('Campo obrigatório'),
        career: S.number().required('Campo obrigatório'),
      }),
    })
  ),
})

const useCalculatorForm = () =>
  useForm<FormData>({
    resolver: yupResolver(schema),
  })

export { useCalculatorForm }
