import React from 'react'
import { hot as hoc } from 'react-hot-loader/root'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hot = <T = React.ComponentType<any>>(WrappedComponent: T) =>
  process.env.NODE_ENV !== 'development'
    ? WrappedComponent
    : hoc(WrappedComponent)

export { hot }
