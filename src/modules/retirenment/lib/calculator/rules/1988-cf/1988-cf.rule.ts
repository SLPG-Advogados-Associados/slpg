import { dates } from '../dates'
import { Rule } from '../../lib/engine'

import { possibility as integral } from './possibilities/1988-cf--art-40--integral'
import { possibility as proportional } from './possibilities/1988-cf--art-40--proportional'

const due = dates.ec20
const promulgation = dates.constitution

const rule = new Rule({
  due,
  promulgation,
  title: 'CF 1988',
  description: `Regra do art. 40 da Constituição Federal de 1988, texto original`,
  possibilities: [integral, proportional],
})

export { rule }
