/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useForm as _useForm,
  UseFormOptions,
  Message,
  FieldError,
  ArrayField,
  useFieldArray as _useFieldArray,
} from 'react-hook-form'

import { set, get } from 'lodash'

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

  const field = (name: string): Field => ({
    meta: {
      touched: [].concat(form.formState.touched[name]).some(Boolean),
      error: (form.errors[name] as FieldError)?.message,
    },
    input: {
      name,
      ref: form.register,
    },
  })

  const useFieldArray = <Name extends string, Mapped = Field>(
    name: Name,
    mapper: (
      path: string,
      item: Partial<ArrayField<FormValues[Name][number], 'id'>>
    ) => //
    // @ts-ignore
    Mapped = path => field(path)
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

  const useFields = (structure: string[], prefix = '') => {
    const result = {} as any

    for (const name of structure) {
      const arrIndex = name.indexOf('[]')

      if (arrIndex === -1) {
        set(result, name, field(`${prefix}${name}`))
      } else {
        const left = name.substr(0, arrIndex)
        // const right = name.substr(arrIndex + 2)
        const curr = get(result, left) || useFieldArray(`${prefix}${left}`)

        // ensure array field is created.
        set(result, left, curr)
      }
    }

    return result
  }

  return { ...form, field, useFieldArray, useFields }
}

export { useForm }
