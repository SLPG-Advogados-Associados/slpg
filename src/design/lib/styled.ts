import { curry } from 'ramda'
import classnames from 'classnames'
import styled, { css, Interpolation } from 'styled-components'
import * as styledTools from 'styled-tools'

const predicate = <P extends {}>(fn, apply: Interpolation<P>, props: P) =>
  fn(props) ? apply : null

const variants = <P extends {}>(map: { [key: string]: Interpolation<any> }) =>
  Object.keys(map).map(prop => styledTools.ifProp(prop, map[prop]))

/**
 * Extended styled-tools#theme to parse array outcomes into CSS valid lists.
 */
const theme = <T = undefined>(path: string, defaultValue?: T) => <Props, Theme>(
  props: Props & { theme: Theme }
) => [].concat(styledTools.theme(path, defaultValue)(props)).join(', ')

// "t" stands for "theme", but it's just a shortcut aggregator anyway.
const t = {
  ...styledTools,
  if: curry(predicate),
  variants: curry(variants),
  theme,
}

export { styled, css, t, classnames }
