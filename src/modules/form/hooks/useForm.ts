/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useForm as _useForm,
  UseFormOptions,
  FieldError,
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

  const field = <Name extends string>(name: Name) => ({
    meta: {
      touched: [].concat(form.formState.touched[name]).some(Boolean),
      error: (form.errors[name] as FieldError)?.message,
    },
    input: {
      name,
      ref: form.register,
    },
  })

  const useFieldArray = <Name extends string>(name: Name) => {
    const api = _useFieldArray<FormValues[Name][number]>({
      name: name as string,
      control: form.control,
    })

    const fields = api.fields.map((item, index) => ({
      item,
      ...field(`${name}[${index}]`),
    }))

    return { ...api, fields }
  }

  const useFields = (structure: string[], prefix = '') => {
    const result = {}

    for (const name of structure) {
      const arrIndex = name.indexOf('[]')

      if (arrIndex === -1) {
        set(result, name, field(`${prefix}${name}`))
      } else {
        const left = name.substr(0, arrIndex)
        // const right = name.substr(arrIndex + 2)

        // ensure array is created.
        set(result, left, get(result, left, []))
      }
    }

    return result
  }

  return { ...form, field, useFieldArray, useFields }
}

export { useForm }
