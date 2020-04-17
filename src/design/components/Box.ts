import { styled, css, t } from '../lib/styled'

const variants = t.variants({
  onClick: css`
    cursor: pointer;

    &:hover,
    &:focus {
      border-color: ${t.theme('colors.divisor--active')};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
        0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }
  `,
})

const Box = styled.div`
  padding: 1rem;
  border: 1px solid ${t.theme('colors.divisor')};
  border-radius: 0.2rem;
  background-color: ${t.theme('colors.white')};

  ${variants}
`

export { Box }
