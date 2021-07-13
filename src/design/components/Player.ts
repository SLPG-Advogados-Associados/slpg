import ReactPlayer from 'react-player'
import styled from 'styled-components'

const Player = styled(ReactPlayer)`
  max-width: 100%;
  height: auto !important;
  padding-top: calc(360 / 640 * 100%);
  overflow: hidden;
  margin: 2em auto 2em;
  position: relative;

  > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
  }
`

export { Player }
