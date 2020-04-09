const classed = <P extends { className?: string }>(
  classes: TemplateStringsArray,
  ...substitutions: string[]
) => (props: P) => {
  const parts = [classes[0]]

  for (let i = 0; i < substitutions.length; i++) {
    parts.push(substitutions[i] + classes[i + 1])
  }

  const className = [parts.join('')]
    .concat(props.className || '')
    .join(' ')
    .replace(/ {2,}/g, ' ')
    .trim()

  return { className }
}

export { classed }
