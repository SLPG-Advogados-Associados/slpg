import type { Rule } from '../lib/rule'

const rules: Rule[] = [
  require('./1988-cf.engine').rule,
  require('./1998-ec-20-permanent.engine').rule,
  require('./1998-ec-20-transition.engine').rule,
  require('./2003-ec-41-permanent.engine').rule,
  require('./2003-ec-41-transition-1.engine').rule,
]

export { rules }
