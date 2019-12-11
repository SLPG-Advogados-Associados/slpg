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

  a {
    position: relative;
    border-bottom: 1px dashed;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      transition: 250ms all;
    }

    &:hover::after,
    &:focus::after {
      top: -0.2em;
      right: -0.2em;
      bottom: -0.2em;
      left: -0.2em;
      background-color: rgba(0, 0, 0, 0.065);
    }
  }

  ${Image} {
    max-width: 48em;
    margin: 2em auto;
  }
`

export { HTMLContent }
