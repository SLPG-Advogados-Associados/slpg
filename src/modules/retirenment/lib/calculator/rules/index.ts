import type { Rule } from '../lib/engine'

const rules: Rule[] = [
  require('./1988-cf').rule,
  require('./1998-ec-20').rule,
  require('./2003-ec-41').rule,
]

export { rules }
