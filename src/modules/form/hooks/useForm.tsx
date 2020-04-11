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
  const form = _useForm<FormValues, ValidationContext>({
    mode: 'onBlur',
    ...options,
  })

  const field = (name: keyof FormValues) => ({
    meta: {
      touched: [].concat(form.formState.touched[name]).some(Boolean),
      error: (form.errors[name] as FieldError)?.message,
    },
    input: {
      name,
      ref: form.register,
    },
  })

  return { ...form, field }
}

export { useForm }
