import React from 'react'

const ErrorMessage: React.FC<{
  message?: React.ReactNode
}> = ({ message }) =>
  message ? (
    <span className="text-meta text-danger block p-2">{message}</span>
  ) : null

export { ErrorMessage }
