import React from 'react'
import { ErrorMessage } from '@hookform/error-message'
import classnames from 'classnames'
import { ErrorMessage as RenderError } from './ErrorMessage'

const FieldWrapper = <
  C extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>({
  name,
  className,
  children,
  wrapper,
  label,
}: {
  name?: string
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
      {name ? <ErrorMessage name={name} render={RenderError} /> : null}
    </Wrapper>
  )
}

export { FieldWrapper }
