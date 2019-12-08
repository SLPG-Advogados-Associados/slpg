import { classed } from '../lib/classed'
import { styled, css, t } from '../lib/styled'

const fullOnMobile = css`
  padding: 0;

  @media screen and (min-width: ${t.theme('screens.lg')}) {
    padding: 0 ${t.theme('spacing.8')};
  }
`

const Container = styled(classed.div`container mx-auto`)<{
  fullOnMobile?: boolean
}>`
  padding: 0 ${t.theme('spacing.8')};
  ${t.ifProp('fullOnMobile', fullOnMobile)}
`

export { Container }
