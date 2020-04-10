import { useForm, FormContextValues } from 'react-hook-form'

const field = <Form extends FormContextValues>(form: Form, name: string) => ({
  meta: {
    name,
    touched: form.formState.touched[name],
    error: form.errors[name]?.message,
  },
  field: {
    name,
    ref: form.register,
  },
})

export { field, useForm }
