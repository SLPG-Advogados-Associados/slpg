import React from 'react'
import classnames from 'classnames'
import { ErrorMessage } from './ErrorMessage'

const FieldWrapper: React.FC<{
  touched?: boolean
  error?: React.ReactNode
  className?: string
}> = ({ touched, error, className, children }) => (
  <label className={classnames('mb-4 block', className)}>
    {children}
    <ErrorMessage touched={touched} error={error} />
  </label>
)

export { FieldWrapper }
