import { Rule } from '../../lib/engine/rule'
import { dates } from '../dates'

import { possibility as integral } from './possibilities/1998-ec-20-transition--art-8--integral'
import { possibility as proportional } from './possibilities/1998-ec-20-transition--art-8--proportional'

const promulgation = dates.ec20
const due = dates.ec41

const rule = new Rule({
  promulgation,
  due,
  title: 'EC nº 20 - Regra de Transição',
  description: 'Regra de transição como descrita na EC nº 20, de 1998',
  possibilities: [integral, proportional],
})

export { rule }
