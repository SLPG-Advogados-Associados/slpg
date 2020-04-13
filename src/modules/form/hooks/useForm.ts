/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useForm as _useForm,
  UseFormOptions,
  Message,
  FieldError,
  FieldName,
  ArrayField,
  useFieldArray as _useFieldArray,
} from 'react-hook-form'

import { get } from 'lodash'

const useForm = <
  FormValues extends Record<string, any> = Record<string, any>,
  ValidationContext extends object = object
>(
  options?: UseFormOptions<FormValues, ValidationContext>
) => {
  const form = _useForm<FormValues, ValidationContext>({
    mode: 'onBlur',
    ...options,
  })

  type Field = {
    meta: {
      touched: boolean
      error: Message
    }
    input: {
      name: string
      ref: typeof form.register
    }
  }

  const useField = <Name extends FieldName<FormValues>>(name: Name): Field => ({
    meta: {
      touched: [].concat(get(form.formState.touched, name)).some(Boolean),
      error: (get(form.errors, name) as FieldError)?.message,
    },
    input: {
      name,
      ref: form.register,
    },
  })

  const useFieldArray = <Name extends FieldName<FormValues>, Mapped = Field>(
    name: Name,
    mapper: (
      path: string,
      item: Partial<ArrayField<FormValues[Name][number], 'id'>>
    ) => //
    // @ts-ignore
    Mapped = path => useField(path)
  ) => {
    const api = _useFieldArray<FormValues[Name][number]>({
      name: name as string,
      control: form.control,
    })

    const items = api.fields.map((item, index) => ({
      item,
      field: mapper(`${name}[${index}]`, item),
    }))

    return { ...api, items }
  }

  return { ...form, useField, useFieldArray }
}

export { useForm }
