import React from 'react'

const ErrorMessage: React.FC<{
  touched?: boolean
  error?: React.ReactNode
}> = ({ touched, error }) =>
  touched && error ? (
    <span className="text-meta text-danger block p-2">{error}</span>
  ) : null

export { ErrorMessage }
