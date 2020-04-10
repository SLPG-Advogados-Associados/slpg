import { HTMLAttributes } from 'react'
import { StyledComponent } from 'styled-components'
import { classed } from '../lib/classed-str'
import { styled, t } from '../lib/styled'

type Props = HTMLAttributes<HTMLHeadingElement> & {
  noMargins?: boolean
}

const variants = t.variants({
  noMargins: 'margin: 0;',
})

type TitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const gen = <Tag extends TitleTag>(
  tag: Tag,
  classes: string
  // @ts-ignore
): StyledComponent<Tag, any, Props> =>
  // @ts-ignore
  styled[tag].attrs(classed([classes]))`
    ${variants}
  `

// prettier-ignore
const Heading = gen('h2', 'text-heading mt-16 mb-10 text-center uppercase')
// prettier-ignore
const Title = gen('h2', 'text-title font-semibold my-4 text-center uppercase')
// prettier-ignore
const TextualTitle = gen('h2', 'text-textual-title my-4 text-left pb-2 border-b')
// prettier-ignore
const ItemTitle = gen('h3', 'text-item-title font-semibold mb-2')
// prettier-ignore
const AsideTitle = gen('h4', 'text-text text-aside-title font-bold uppercase mb-2')

export { Title, TextualTitle, ItemTitle, Heading, AsideTitle }
