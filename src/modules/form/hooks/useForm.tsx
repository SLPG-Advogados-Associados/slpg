/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useForm as _useForm,
  UseFormOptions,
  FieldError,
} from 'react-hook-form'

const useForm = <
  FormValues extends Record<string, any> = Record<string, any>,
  ValidationContext extends object = object
>(
  options: UseFormOptions<FormValues, ValidationContext>
) => {
  const form = _useForm<FormValues, ValidationContext>(options)

  const field = (name: keyof FormValues) => ({
    meta: {
      name,
      touched: form.formState.touched[name],
      error: (form.errors[name] as FieldError)?.message,
    },
    field: {
      name,
      ref: form.register,
    },
  })

  return { ...form, field }
}

export { useForm }
