import { styled, t } from '~design'

const Input = styled.input`
  width: 100%;
  padding: 0.85em 1em;
  color: inherit;
  border: 1px solid ${t.theme('colors.border')};
  font-size: ${t.theme('fontSize.200')};
`

export { Input }
