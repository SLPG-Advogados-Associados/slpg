import React from 'react'

type Props = { touched?: boolean; error?: React.ReactElement }

const Field: React.FC<Props> = ({ touched, error, children }) => (
  <label className="mb-4 block">
    {children}

    {touched && error ? (
      <span className="text-meta text-danger block p-2">{error}</span>
    ) : null}
  </label>
)

export { Field }
