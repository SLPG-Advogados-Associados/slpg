import { styled, t } from '../lib/styled'
import { Image } from './Image'

const HTMLContent = styled.div`
  line-height: 1.8;
  font-size: ${t.theme('fontSize.text')};
  color: ${t.theme('colors.text')};

  h3,
  h4,
  h5 {
    margin-bottom: 0.5em;
    color: ${t.theme('colors.primary')};
  }

  h3 {
    font-size: 1.25em;
  }

  ul {
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 1.4em;
  }

  ${Image} {
    max-width: 48em;
    margin: 2em auto;
  }
`

export { HTMLContent }
