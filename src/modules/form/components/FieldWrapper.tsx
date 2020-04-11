import React from 'react'
import classnames from 'classnames'
import { ErrorMessage } from './ErrorMessage'

const FieldWrapper = <
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>({
  touched,
  error,
  className,
  children,
  wrapper,
}: {
  touched?: boolean
  error?: React.ReactNode
  className?: string
  children: React.ReactNode
  wrapper?: C
}) => {
  const Wrapper = wrapper ? wrapper : 'label'

  return (
    <Wrapper className={classnames('mb-4 block', className)}>
      {children}
      <ErrorMessage touched={touched} error={error} />
    </Wrapper>
  )
}

export { FieldWrapper }
