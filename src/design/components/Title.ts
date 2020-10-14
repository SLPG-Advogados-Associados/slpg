import { HTMLAttributes } from 'react'

import { classed } from '../lib/classed'
import { styled, t } from '../lib/styled'

type Props = HTMLAttributes<any> & {
  noMargins?: boolean
}

const variants = {
  noMargins: 'margin: 0;',
}

const factory = <T extends 'h1' | 'h2' | 'h3' | 'h4'>(
  tag: T,
  classes: string
) =>
  styled.h1.attrs(classed(classes))<Props>`
    ${t.variants(variants)}
  `.withComponent(tag)

// prettier-ignore
const Heading = factory('h2', 'text-heading mt-16 mb-10 text-center uppercase')
// prettier-ignore
const Title = factory('h2', 'text-title font-semibold my-4 text-center uppercase')
// prettier-ignore
const TextualTitle = factory('h2', 'text-textual-title my-4 text-left pb-2 border-b')
// prettier-ignore
const ItemTitle = factory('h3', 'text-item-title font-semibold mb-2')
// prettier-ignore
const AsideTitle = factory('h4', 'text-text text-aside-title font-bold uppercase mb-2')

export { Title, TextualTitle, ItemTitle, Heading, AsideTitle }
