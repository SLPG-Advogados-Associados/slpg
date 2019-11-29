import { styled, t } from '../lib/styled'

const HTMLContent = styled.div`
  font-size: 1rem;
  line-height: 1.8;

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
`

export { HTMLContent }
