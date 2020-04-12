import React from 'react'

const ErrorMessage: React.FC<{
  error?: React.ReactNode
}> = ({ error }) =>
  error ? (
    <span className="text-meta text-danger block p-2">{error}</span>
  ) : null

export { ErrorMessage }
