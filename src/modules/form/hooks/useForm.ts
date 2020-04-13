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

  type Field<Name extends FieldName<FormValues>> = {
    value: FormValues[Name]
    meta: {
      touched: boolean
      error: Message
    }
    input: {
      name: string
      ref: typeof form.register
    }
  }

  const useField = <Name extends FieldName<FormValues>>(
    name: Name
  ): Field<Name> => {
    const touched = [].concat(get(form.formState.touched, name)).some(Boolean)
    const error = (get(form.errors, name) as FieldError)?.message

    const field = {
      meta: { touched, error },
      input: { name, ref: form.register },
    }

    return new Proxy(field as any, {
      get: (obj, prop) => (prop === 'value' ? form.watch(name) : obj[prop]),
      set: (obj, prop, value) => {
        if (prop === 'value') {
          form.setValue(name, value)
        } else {
          obj[prop] = value
        }

        return true
      },
    })
  }

  const useFieldArray = <
    Name extends FieldName<FormValues>,
    Mapped = Field<Name>
  >(
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
      // value: form.watch(`${name}[${index}]`),
      field: mapper(`${name}[${index}]`, item),
    }))

    const field = { ...api, items }

    type Field = typeof field & {
      value: FormValues[Name]
    }

    return new Proxy<Field>(field as any, {
      get: (obj, prop) => (prop === 'value' ? form.watch(name) : obj[prop]),
      set: (obj, prop, value) => {
        if (prop === 'value') {
          form.setValue(name, value)
        } else {
          obj[prop] = value
        }

        return true
      },
    })
  }

  return { ...form, useField, useFieldArray }
}

export { useForm }
