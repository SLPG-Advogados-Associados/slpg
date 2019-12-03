import { ElementType } from 'react'
import classnames from 'classnames'
import * as classedTags from './classed-tags'
import { styled } from './styled'

type Classed = typeof classedTags & {
  <C extends ElementType<any>>(Component: C): (
    classNames: TemplateStringsArray
  ) => C
}

// @ts-ignore
const classed: Classed = Component => classNames =>
  // @ts-ignore
  styled(Component).attrs(({ className }) => ({
    className: classnames(className, classNames.join(' ')),
  }))``

for (const tag in classedTags) {
  classed[tag] = classedTags[tag]
}

export { classed }
