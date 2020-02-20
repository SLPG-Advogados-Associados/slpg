import React from 'react'
import { Field as FormikField } from 'formik'
import { Input } from './Input'

const Field: typeof FormikField = ({
  name,
  component: Component,
  ...props
}) => (
  <FormikField name={name}>
    {({ field, meta }) => (
      <label className="mb-4 block">
        <Component {...field} {...props} />

        {meta.touched && meta.error ? (
          <span className="text-meta text-danger block p-2">{meta.error}</span>
        ) : null}
      </label>
    )}
  </FormikField>
)

const TextField: typeof Field = props => <Field component={Input} {...props} />

const TextAreaField: typeof Field = props => (
  <Field component={Input} as="textarea" {...props} />
)

export { TextField, TextAreaField }
