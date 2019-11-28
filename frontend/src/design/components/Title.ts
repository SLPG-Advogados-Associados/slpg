import * as classed from '../lib/classed-tags'
import { AnyStyledComponent, StyledComponent } from 'styled-components'
import { styled, t, css } from '../lib/styled'

interface Props {
  noMargins?: boolean
}

const variants = {
  noMargins: 'margin: 0;',
}

const c = (component: AnyStyledComponent) =>
  styled(component as StyledComponent<React.FC<Props>, any>)`
    ${t.variants(variants)}
  `

// prettier-ignore
const Heading = c(classed.h2`text-heading font-semibold mt-16 mb-10 text-center uppercase`)
const Title = c(classed.h2`text-title font-semibold my-4 text-center uppercase`)
const ItemTitle = c(classed.h3`text-item-title font-semibold mb-2`)
const AsideTitle = c(classed.h4`text-aside font-bold uppercase mb-2`)

export { Title, ItemTitle, Heading, AsideTitle }
