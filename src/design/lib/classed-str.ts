const classed = <P extends {}>(
  classes: TemplateStringsArray | string[],
  ...substitutions: Array<string | ((props: P) => string)>
) => (props: P) => {
  const parts = [classes[0]]

  for (let i = 0; i < substitutions.length; i++) {
    const substitution = substitutions[i]

    const interpolated =
      typeof substitution === 'function' ? substitution(props) : substitution

    parts.push(interpolated + classes[i + 1])
  }

  const className = (!substitutions.length ? [...classes] : [parts.join('')])
    // @ts-ignore
    .concat(props.className || '')
    .join(' ')
    .replace(/ {2,}/g, ' ')
    .trim()

  return { className }
}

export { classed }
