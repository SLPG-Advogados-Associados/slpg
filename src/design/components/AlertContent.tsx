import React from 'react'

const AlertContent: React.FC<{ title?: React.ReactNode }> = ({
  title,
  children,
}) => (
  <>
    {title ? <h3 className="font-bold">{title}</h3> : null}
    {children}
  </>
)

export { AlertContent }
