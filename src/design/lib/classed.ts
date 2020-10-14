import classnames from 'classnames'

/**
 * Helper prop mapping factory to append className to props.
 */
const classed = <P extends { className?: string }>(toAdd: string) => ({
  className,
}: P) => ({ className: classnames(className, toAdd) })

export { classed }
