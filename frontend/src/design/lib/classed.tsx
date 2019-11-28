import React, { ElementType, ComponentPropsWithRef, ReactElement } from 'react'
import classnames from 'classnames'
import * as classedTags from './classed-tags'

type Classed = typeof classedTags & {
  <C extends ElementType<any>>(Component: C): (
    classNames: TemplateStringsArray
  ) => (props: ComponentPropsWithRef<C>) => ReactElement
}

// @ts-ignore
const classed: Classed = Component => classNames => props => (
  // @ts-ignore
  <Component {...props} className={classnames(classNames, props.className)} />
)

for (const tag in classedTags) {
  classed[tag] = classedTags[tag]
}

export { classed }
