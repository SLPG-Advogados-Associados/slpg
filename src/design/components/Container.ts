import { classed } from '../lib/classed'
import { styled, css, t } from '../lib/styled'

const fullOnMobile = css`
  padding-left: 0;
  padding-right: 0;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    padding-left: ${t.theme('spacing.8')};
    padding-right: ${t.theme('spacing.8')};
  }
`

const Container = styled.div.attrs(classed('container mx-auto'))<{
  fullOnMobile?: boolean
}>`
  padding-left: ${t.theme('spacing.8')};
  padding-right: ${t.theme('spacing.8')};

  ${t.ifProp('fullOnMobile', fullOnMobile)}
`

export { Container }
