import React from 'react'
import classnames from 'classnames'
import { ErrorMessage } from './ErrorMessage'

const FieldWrapper = <
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>({
  error,
  className,
  children,
  wrapper,
  label,
}: {
  error?: React.ReactNode
  className?: string
  children: React.ReactNode
  wrapper?: C
  label?: string
}) => {
  const Wrapper = wrapper ? wrapper : 'label'

  return (
    <Wrapper className={classnames('mb-4 block', className)}>
      {label ? <strong className="mb-1 block">{label}</strong> : null}
      {children}
      <ErrorMessage error={error} />
    </Wrapper>
  )
}

export { FieldWrapper }
